from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import LoginTokenSerializer


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(TokenObtainPairView):
    """
    JWT Login View
    POST /api/accounts/login/
    """
    permission_classes = []
    authentication_classes = []
    serializer_class = LoginTokenSerializer
