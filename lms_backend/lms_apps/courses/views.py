from rest_framework.views import APIView
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
