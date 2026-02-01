from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from lms_apps.academics.models import Marks
from lms_apps.academics.serializers import MarksSerializer
from lms_apps.accounts.permissions import IsTeacher, IsStudent


class MarksViewSet(ModelViewSet):
    """
    Teacher-only API to add/update marks and remarks
    College-level data isolation enforced at queryset level
    """
    serializer_class = MarksSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return (
            Marks.objects
            .select_related("student", "subject", "teacher")
            .filter(student__college=self.request.user.college)
        )

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class StudentAcademicHistoryView(ListAPIView):
    """
    Read-only API for students to view their academic history
    """
    serializer_class = MarksSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return (
            Marks.objects
            .select_related("subject", "teacher")
            .filter(student=self.request.user)
        )
