from django.urls import path
from .views import GenerateAIReportView, StudentAIReportsView

urlpatterns = [
    path("generate/", GenerateAIReportView.as_view()),
    path("my-reports/", StudentAIReportsView.as_view()),
]
