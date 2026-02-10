from django.urls import path
from .views import (
    AdminCourseView,
    StudentCoursesView,
    AdminCourseDetailView,  # 👈 ADD
)

urlpatterns = [
    # College Admin – list & create courses
    path("courses/", AdminCourseView.as_view()),

    # College Admin – retrieve / update course
    path("courses/<int:pk>/", AdminCourseDetailView.as_view()),  # 👈 ADD

    # Student – enrolled courses
    path("courses/enrolled/", StudentCoursesView.as_view()),
]
