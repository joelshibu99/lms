from django.urls import path
from .views import (
    GenerateAIReportView,
    StudentLatestAIReportView,
    StudentChatWithAIReportView,
    TeacherAIReportListView,
)

urlpatterns = [
    path("generate/", GenerateAIReportView.as_view()),
    path("teacher-reports/", TeacherAIReportListView.as_view()),
    path("student-latest/", StudentLatestAIReportView.as_view()),
    path("student-chat/", StudentChatWithAIReportView.as_view()),
]
