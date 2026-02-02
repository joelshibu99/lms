from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LoginView, UserViewSet
from .views import TeacherStudentListView


router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    # JWT login
    path("login/", LoginView.as_view(), name="accounts-login"),

    # College users (teachers, students, staff)
    path("", include(router.urls)),

    path("teacher-students/", TeacherStudentListView.as_view()),

]
