from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Course, Enrollment
from lms_apps.accounts.models import User
from lms_apps.academics.models import Subject
from .serializers import CourseSerializer, EnrolledCourseSerializer


# ─────────────────────────────────────────
# COLLEGE ADMIN – LIST + CREATE COURSES ✅
# ─────────────────────────────────────────
class AdminCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=403)

        courses = Course.objects.filter(college=request.user.college)
        return Response(CourseSerializer(courses, many=True).data)

    def post(self, request):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=403)

        data = request.data

        # Validate subject
        try:
            subject = Subject.objects.get(id=data["subject"])
        except Subject.DoesNotExist:
            return Response(
                {"detail": "Invalid subject ID"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = Course.objects.create(
            college=request.user.college,
            code=data["code"],
            name=data["name"],
            subject=subject,
            is_active=data.get("is_active", True),
        )

        return Response(
            CourseSerializer(course).data,
            status=status.HTTP_201_CREATED,
        )


# ─────────────────────────────────────────
# TEACHER – ASSIGNED COURSES ✅ (RESTORED)
# ─────────────────────────────────────────
class TeacherCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "TEACHER":
            return Response(status=403)

        courses = Course.objects.filter(teacher=request.user)
        return Response(CourseSerializer(courses, many=True).data)


# ─────────────────────────────────────────
# STUDENT – ENROLLED COURSES ✅
# ─────────────────────────────────────────
class StudentCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "STUDENT":
            return Response(status=403)

        enrollments = Enrollment.objects.filter(student=request.user)
        return Response(
            EnrolledCourseSerializer(enrollments, many=True).data
        )


# ─────────────────────────────────────────
# ADMIN – ASSIGN TEACHER
# ─────────────────────────────────────────
class AssignTeacherView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=403)

        teacher = User.objects.get(id=request.data["teacher_id"])
        course = Course.objects.get(id=course_id)

        course.teacher = teacher
        course.save()

        return Response({"detail": "Teacher assigned"})


# ─────────────────────────────────────────
# ADMIN – ENROLL STUDENT
# ─────────────────────────────────────────
class EnrollStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        if request.user.role != "COLLEGE_ADMIN":
            return Response(status=403)

        Enrollment.objects.get_or_create(
            student_id=request.data["student_id"],
            course_id=course_id,
        )

        return Response({"detail": "Student enrolled"})
