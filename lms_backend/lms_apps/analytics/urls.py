from django.urls import path
from .views import (
    CollegePerformanceView,
    AttendanceStatsView,
    StudentRiskView,
    TeacherRiskOverviewView,
)

urlpatterns = [
    path("college-summary/", CollegePerformanceView.as_view()),
    path("attendance-stats/", AttendanceStatsView.as_view()),
    path("student-risk/<int:student_id>/", StudentRiskView.as_view()),
    path("teacher-risk-overview/", TeacherRiskOverviewView.as_view()),

]
