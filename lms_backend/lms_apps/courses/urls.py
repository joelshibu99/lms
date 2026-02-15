from django.urls import path
from .views import (
    AdminCourseView,
    StudentCoursesView,
    AdminCourseDetailView,
    TeacherCoursesView,
    CourseEnrollmentListView,
    EnrollStudentView,
    RemoveEnrollmentView,
)

urlpatterns = [
    # College Admin – list & create courses
    path("courses/", AdminCourseView.as_view()),

    # College Admin – retrieve / update course
    path("courses/<int:pk>/", AdminCourseDetailView.as_view()),

    # Teacher – assigned courses
    path("courses/assigned/", TeacherCoursesView.as_view()),

    # Student – enrolled courses
    path("courses/enrolled/", StudentCoursesView.as_view()),

    # Enrollments
    path("courses/<int:course_id>/enrollments/", CourseEnrollmentListView.as_view()),
    path("courses/<int:course_id>/enroll/", EnrollStudentView.as_view()),
    path("enrollments/<int:enrollment_id>/remove/", RemoveEnrollmentView.as_view()),
]
