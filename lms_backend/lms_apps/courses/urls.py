from django.urls import path
from .views import (
    AdminCourseView,
    StudentCoursesView,
)

urlpatterns = [
    # College Admin – list & create courses
    path("courses/", AdminCourseView.as_view()),

    # Student – enrolled courses
    path("courses/enrolled/", StudentCoursesView.as_view()),
]
