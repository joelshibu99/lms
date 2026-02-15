from django.urls import path, include
from rest_framework.routers import DefaultRouter

from lms_apps.academics.views import (
    MarksViewSet,
    StudentAcademicHistoryView,
    CourseSubjectListView,
    CourseSubjectCreateView,
    AssignSubjectTeacherView,
    SubjectViewSet,   # ✅ ADD THIS
)

router = DefaultRouter()
router.register(r"marks", MarksViewSet, basename="marks")
router.register(r"subjects", SubjectViewSet, basename="subjects")  # ✅ ADD THIS

urlpatterns = [
    path(
        "student-history/",
        StudentAcademicHistoryView.as_view(),
        name="student-academic-history",
    ),

    path("", include(router.urls)),

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

    path(
        "subjects/<int:subject_id>/assign-teacher/",
        AssignSubjectTeacherView.as_view(),
        name="assign-subject-teacher",
    ),
]
