from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializers import (
    LoginTokenSerializer,
    UserSerializer,
    CollegeUserCreateSerializer,
)
from .permissions import IsCollegeAdmin

# 🔥 Import Subject model (IMPORTANT)
from lms_apps.academics.models import Subject


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(TokenObtainPairView):
    """
    JWT Login View
    POST /api/accounts/login/
    """
    permission_classes = []
    authentication_classes = []
    serializer_class = LoginTokenSerializer


from rest_framework.exceptions import PermissionDenied


class UserViewSet(ModelViewSet):
    """
    SYSTEM_ADMIN:
        - Full access to all users

    COLLEGE_ADMIN:
        - Manage users only within their college
    """

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # SYSTEM ADMIN → All users
        if user.role == "SYSTEM_ADMIN":
            return User.objects.exclude(id=user.id)

        # COLLEGE ADMIN → Only their college users
        if user.role == "COLLEGE_ADMIN":
            return User.objects.filter(
                college=user.college
            ).exclude(id=user.id)

        raise PermissionDenied("You do not have permission.")

    def get_serializer_class(self):
        if self.action == "create":
            return CollegeUserCreateSerializer
        return UserSerializer

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        # 🔒 Restrict non-admin roles
        if user.role not in ["SYSTEM_ADMIN", "COLLEGE_ADMIN"]:
            raise PermissionDenied("You do not have permission.")

        # 🔥 Prevent College Admin from modifying other colleges
        if user.role == "COLLEGE_ADMIN":
            if instance.college != user.college:
                raise PermissionDenied("Cannot modify user outside your college.")

        # 🔥 Business Rule: Cannot deactivate teacher assigned to subjects
        is_active = request.data.get("is_active", None)

        if is_active is False and instance.role == "TEACHER":
            assigned_subjects = Subject.objects.filter(
                teacher=instance
            ).exists()

            if assigned_subjects:
                return Response(
                    {
                        "detail": "Cannot deactivate teacher assigned to subjects."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return super().partial_update(request, *args, **kwargs)


# -------------------------
# Teacher Student View
# -------------------------
from rest_framework.generics import ListAPIView
from lms_apps.accounts.permissions import IsTeacher
from lms_apps.accounts.serializers import StudentListSerializer


class TeacherStudentListView(ListAPIView):
    """
    Teacher:
    - List students in their college
    """
    serializer_class = StudentListSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return User.objects.filter(
            role="STUDENT",
            college=self.request.user.college
        )
