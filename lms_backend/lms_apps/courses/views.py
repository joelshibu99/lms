from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrolledCourseSerializer


# ─────────────────────────────────────────
# COLLEGE ADMIN – LIST + CREATE COURSES
# ─────────────────────────────────────────
class AdminCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        courses = Course.objects.filter(
            college=request.user.college
        )

        return Response(
            CourseSerializer(courses, many=True).data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data

        if not data.get("code") or not data.get("name"):
            return Response(
                {"detail": "code and name are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = Course.objects.create(
            college=request.user.college,
            code=data["code"],
            name=data["name"],
            is_active=data.get("is_active", True),
        )

        return Response(
            CourseSerializer(course).data,
            status=status.HTTP_201_CREATED,
        )


# ─────────────────────────────────────────
# COLLEGE ADMIN – RETRIEVE + UPDATE COURSE
# ─────────────────────────────────────────
class AdminCourseDetailView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CourseSerializer

    def get_queryset(self):
        # Admin can only edit courses of their college
        return Course.objects.filter(
            college=self.request.user.college
        )


# ─────────────────────────────────────────
# STUDENT – ENROLLED COURSES
# ─────────────────────────────────────────
class StudentCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "STUDENT":
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        enrollments = Enrollment.objects.filter(
            student=request.user
        )

        return Response(
            EnrolledCourseSerializer(enrollments, many=True).data,
            status=status.HTTP_200_OK
        )
from lms_apps.accounts.models import User
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView


# ─────────────────────────────────────────
# COLLEGE ADMIN – LIST ENROLLED STUDENTS
# ─────────────────────────────────────────
class CourseEnrollmentListView(ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=status.HTTP_403_FORBIDDEN)

        enrollments = Enrollment.objects.filter(
            course__id=course_id,
            course__college=request.user.college
        ).select_related("student")

        data = [
            {
                "id": e.id,
                "student_id": e.student.id,
                "email": e.student.email,
                "full_name": e.student.full_name,
            }
            for e in enrollments
        ]

        return Response(data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────
# COLLEGE ADMIN – ENROLL STUDENT
# ─────────────────────────────────────────
class EnrollStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=status.HTTP_403_FORBIDDEN)

        student_id = request.data.get("student_id")

        try:
            course = Course.objects.get(
                id=course_id,
                college=request.user.college
            )
            student = User.objects.get(
                id=student_id,
                role="STUDENT",
                college=request.user.college
            )
        except (Course.DoesNotExist, User.DoesNotExist):
            return Response(
                {"detail": "Invalid course or student"},
                status=status.HTTP_400_BAD_REQUEST
            )

        enrollment, created = Enrollment.objects.get_or_create(
            student=student,
            course=course
        )

        if not created:
            return Response(
                {"detail": "Student already enrolled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "Student enrolled successfully"},
            status=status.HTTP_201_CREATED
        )


# ─────────────────────────────────────────
# COLLEGE ADMIN – REMOVE STUDENT
# ─────────────────────────────────────────
class RemoveEnrollmentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, enrollment_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            enrollment = Enrollment.objects.get(
                id=enrollment_id,
                course__college=request.user.college
            )
        except Enrollment.DoesNotExist:
            return Response(
                {"detail": "Enrollment not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        enrollment.delete()

        return Response(
            {"detail": "Student removed from course"},
            status=status.HTTP_200_OK
        )
# ─────────────────────────────────────────
# TEACHER – ASSIGNED COURSES
# ─────────────────────────────────────────
class TeacherCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "TEACHER":
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Teacher gets courses via subjects assigned to them
        courses = Course.objects.filter(
            subjects__teacher=request.user
        ).distinct()

        return Response(
            CourseSerializer(courses, many=True).data,
            status=status.HTTP_200_OK
        )
