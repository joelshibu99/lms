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


class UserViewSet(ModelViewSet):
    """
    College Admin:
    - GET  -> list users of their college
    - POST -> create teacher / student / staff
    - PATCH -> activate / deactivate users
    """
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get_queryset(self):
        return User.objects.filter(
            college=self.request.user.college
        ).exclude(id=self.request.user.id)

    def get_serializer_class(self):
        if self.action == "create":
            return CollegeUserCreateSerializer
        return UserSerializer

    # 🔥 BUSINESS RULE PROTECTION
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Check if trying to deactivate
        is_active = request.data.get("is_active", None)

        if is_active is False and instance.role == "TEACHER":
            # Check if teacher is assigned to any subjects
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
