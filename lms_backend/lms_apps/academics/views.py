from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from lms_apps.academics.models import Marks
from lms_apps.academics.serializers import (
    MarksSerializer,
    StudentMarksSerializer,
)
from lms_apps.accounts.permissions import IsTeacher, IsStudent


class MarksViewSet(ModelViewSet):
    """
    Teacher-only API:
    - View marks entered by THIS teacher
    - Add / update marks
    """
    serializer_class = MarksSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return (
            Marks.objects
            .select_related("student", "subject")
            .filter(teacher=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class StudentAcademicHistoryView(ListAPIView):
    """
    Student-only API:
    - View academic history
    """
    serializer_class = StudentMarksSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return (
            Marks.objects
            .select_related("subject", "teacher")
            .filter(student=self.request.user)
        )
from rest_framework.generics import ListAPIView
from lms_apps.academics.models import Subject
from lms_apps.academics.serializers import SubjectSerializer
from lms_apps.accounts.permissions import IsTeacher


class TeacherSubjectListView(ListAPIView):
    """
    Teacher:
    - List subjects in their college
    """
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Subject.objects.filter(
            college=self.request.user.college
        )
