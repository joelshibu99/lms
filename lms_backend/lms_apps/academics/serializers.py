from rest_framework import serializers
from lms_apps.academics.models import Subject, Marks


class SubjectSerializer(serializers.ModelSerializer):
    """
    Serializer for academic subjects (college-scoped)
    """
    class Meta:
        model = Subject
        fields = "__all__"


class MarksSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)
    student_email = serializers.CharField(source="student.email", read_only=True)

    class Meta:
        model = Marks
        fields = [
            "id",
            "student",
            "student_email",
            "subject",
            "subject_name",
            "marks_obtained",   # ✅ CORRECT FIELD
            "teacher",
            "teacher_name",
            "remarks",
            "created_at",
        ]
        read_only_fields = ("teacher", "created_at")



from rest_framework import serializers
from lms_apps.academics.models import Marks


class StudentMarksSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name", read_only=True
    )
    teacher_name = serializers.CharField(
        source="teacher.full_name", read_only=True
    )
    marks = serializers.DecimalField(
        source="marks_obtained",
        max_digits=5,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Marks
        fields = [
            "id",
            "subject_name",
            "marks",
            "teacher_name",
            "created_at",
        ]
