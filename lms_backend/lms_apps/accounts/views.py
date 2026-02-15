from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import (
    LoginTokenSerializer,
    UserSerializer,
    CollegeUserCreateSerializer,
)
from .permissions import IsCollegeAdmin


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
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from lms_apps.accounts.models import User
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
