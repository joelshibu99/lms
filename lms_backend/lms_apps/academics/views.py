from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from lms_apps.academics.models import Marks, Subject
from lms_apps.academics.serializers import (
    MarksSerializer,
    StudentMarksSerializer,
    SubjectSerializer,
    SubjectCreateSerializer,
)
from lms_apps.accounts.permissions import IsTeacher, IsStudent
from lms_apps.courses.models import Course
from lms_apps.accounts.models import User

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from lms_apps.accounts.permissions import IsTeacher
from .models import Subject
from .serializers import SubjectSerializer


# ─────────────────────────────────────────
# TEACHER – MARKS CRUD
# ─────────────────────────────────────────
class MarksViewSet(ModelViewSet):
    """
    Teacher-only API:
    - View marks entered by THIS teacher
    - Add / update marks
    """
    serializer_class = MarksSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return (
            Marks.objects
            .select_related("student", "subject", "subject__course")
            .filter(teacher=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


# ─────────────────────────────────────────
# STUDENT – ACADEMIC HISTORY
# ─────────────────────────────────────────
class StudentAcademicHistoryView(ListAPIView):
    """
    Student-only API:
    - View academic history (via enrolled courses)
    """
    serializer_class = StudentMarksSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return (
            Marks.objects
            .select_related("subject", "subject__course", "teacher")
            .filter(student=self.request.user)
        )


# ─────────────────────────────────────────
# SUBJECTS UNDER A COURSE (LIST)
# ─────────────────────────────────────────
class CourseSubjectListView(ListAPIView):
    """
    Admin / Teacher:
    - List subjects under a specific course
    """
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs.get("course_id")

        return Subject.objects.filter(
            course_id=course_id,
            college=self.request.user.college
        )


# ─────────────────────────────────────────
# SUBJECTS UNDER A COURSE (CREATE)
# ─────────────────────────────────────────
class CourseSubjectCreateView(CreateAPIView):
    """
    College Admin:
    - Create subject under a course
    """
    serializer_class = SubjectCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            course = Course.objects.get(
                id=course_id,
                college=request.user.college
            )
        except Course.DoesNotExist:
            return Response(
                {"detail": "Invalid course"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        subject = serializer.save(
            course=course,
            college=request.user.college
        )

        return Response(
            SubjectSerializer(subject).data,
            status=status.HTTP_201_CREATED
        )


# ─────────────────────────────────────────
# ASSIGN TEACHER TO SUBJECT
# ─────────────────────────────────────────
class AssignSubjectTeacherView(CreateAPIView):
    """
    College Admin:
    - Assign a teacher to a subject
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, subject_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            subject = Subject.objects.get(
                id=subject_id,
                college=request.user.college
            )
            teacher = User.objects.get(
                id=request.data["teacher_id"],
                role="TEACHER"
            )
        except (Subject.DoesNotExist, User.DoesNotExist, KeyError):
            return Response(
                {"detail": "Invalid subject or teacher"},
                status=status.HTTP_400_BAD_REQUEST
            )

        subject.teacher = teacher
        subject.save()

        return Response(
            {"detail": "Teacher assigned to subject"},
            status=status.HTTP_200_OK
        )
# ─────────────────────────────────────────
# ALL SUBJECTS (College-wide)
# ─────────────────────────────────────────
class SubjectViewSet(ModelViewSet):
    """
    College Admin:
    - View all subjects in their college
    """
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(
            college=self.request.user.college
        )
class TeacherSubjectsView(ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Subject.objects.filter(
            teacher=self.request.user,
            college=self.request.user.college
        )
