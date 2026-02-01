from django.urls import path
from rest_framework.routers import DefaultRouter

from lms_apps.accounts.views import (
    CollegeUserViewSet,
    LoginView,
)

router = DefaultRouter()
router.register(
    "college-users",
    CollegeUserViewSet,
    basename="college-users"
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
]

urlpatterns += router.urls
