from django.urls import path
from .views import (
    AdminCourseView,
    TeacherCoursesView,
    StudentCoursesView,
    AssignTeacherView,
)

urlpatterns = [
    # Courses
    path("courses/", AdminCourseView.as_view()),
    path("courses/assigned/", TeacherCoursesView.as_view()),
    path("courses/enrolled/", StudentCoursesView.as_view()),

    # Assign teacher (ADMIN only)
    path(
        "courses/<int:course_id>/assign-teacher/",
        AssignTeacherView.as_view(),
    ),
]
