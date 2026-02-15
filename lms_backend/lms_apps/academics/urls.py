from django.urls import path, include
from rest_framework.routers import DefaultRouter

from lms_apps.academics.views import (
    MarksViewSet,
    StudentAcademicHistoryView,
    CourseSubjectListView,
    CourseSubjectCreateView,
    AssignSubjectTeacherView,
    SubjectViewSet,
    TeacherSubjectsView,   # ✅ NEW
)

router = DefaultRouter()
router.register(r"marks", MarksViewSet, basename="marks")
router.register(r"subjects", SubjectViewSet, basename="subjects")

urlpatterns = [
    # -------------------------
    # Teacher Subjects Endpoint
    # -------------------------
    path(
        "teacher-subjects/",
        TeacherSubjectsView.as_view(),
        name="teacher-subjects",
    ),

    # -------------------------
    # Student Academic History
    # -------------------------
    path(
        "student-history/",
        StudentAcademicHistoryView.as_view(),
        name="student-academic-history",
    ),

    # -------------------------
    # Course → Subjects
    # -------------------------
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

    # -------------------------
    # Assign Teacher to Subject
    # -------------------------
    path(
        "subjects/<int:subject_id>/assign-teacher/",
        AssignSubjectTeacherView.as_view(),
        name="assign-subject-teacher",
    ),

    # -------------------------
    # ViewSets (Marks + Subjects)
    # -------------------------
    path("", include(router.urls)),
]
