from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from lms_apps.accounts.models import User
from lms_apps.accounts.serializers import CollegeUserCreateSerializer
from lms_apps.core.permissions import IsCollegeAdmin


class LoginView(TokenObtainPairView):
    """
    JWT Login View
    POST /api/accounts/login/
    """
    permission_classes = []


class CollegeUserViewSet(ModelViewSet):
    serializer_class = CollegeUserCreateSerializer
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get_queryset(self):
        return User.objects.filter(
            college=self.request.user.college
        )

    def perform_create(self, serializer):
        serializer.save()
