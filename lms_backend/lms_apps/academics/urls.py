from django.urls import path, include
from rest_framework.routers import DefaultRouter

from lms_apps.academics.views import (
    MarksViewSet,
    StudentAcademicHistoryView,
    CourseSubjectListView,
    CourseSubjectCreateView,
    AssignSubjectTeacherView,
)

router = DefaultRouter()
router.register(r"marks", MarksViewSet, basename="marks")

urlpatterns = [
    # Student academic history
    path(
        "student-history/",
        StudentAcademicHistoryView.as_view(),
        name="student-academic-history",
    ),

    # Marks CRUD (teacher)
    path("", include(router.urls)),

    # Subjects under a course
    path(
        "courses/<int:course_id>/subjects/",
        CourseSubjectListView.as_view(),
        name="course-subjects-list",
    ),
    path(
        "courses/<int:course_id>/subjects/create/",
        CourseSubjectCreateView.as_view(),
        name="course-subjects-create",
    ),

    # Assign teacher to subject
    path(
        "subjects/<int:subject_id>/assign-teacher/",
        AssignSubjectTeacherView.as_view(),
        name="assign-subject-teacher",
    ),
]
