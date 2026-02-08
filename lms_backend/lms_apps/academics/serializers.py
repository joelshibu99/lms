from rest_framework import serializers
from lms_apps.academics.models import Subject, Marks


# ─────────────────────────────────────────
# SUBJECT SERIALIZERS
# ─────────────────────────────────────────

class SubjectSerializer(serializers.ModelSerializer):
    """
    Read serializer for subjects (course-scoped)
    """
    course_code = serializers.CharField(
        source="course.code", read_only=True
    )
    course_name = serializers.CharField(
        source="course.name", read_only=True
    )
    teacher_name = serializers.CharField(
        source="teacher.full_name", read_only=True
    )

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "code",
            "course",
            "course_code",
            "course_name",
            "teacher",
            "teacher_name",
        ]


class SubjectCreateSerializer(serializers.ModelSerializer):
    """
    Admin-only:
    Create subject under a course
    """
    class Meta:
        model = Subject
        fields = [
            "name",
            "code",
            "course",
        ]


# ─────────────────────────────────────────
# MARKS SERIALIZERS (TEACHER)
# ─────────────────────────────────────────

class MarksSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name", read_only=True
    )
    course_code = serializers.CharField(
        source="subject.course.code", read_only=True
    )
    student_email = serializers.CharField(
        source="student.email", read_only=True
    )
    teacher_name = serializers.CharField(
        source="teacher.full_name", read_only=True
    )

    class Meta:
        model = Marks
        fields = [
            "id",
            "student",
            "student_email",
            "subject",
            "subject_name",
            "course_code",
            "marks_obtained",
            "teacher",
            "teacher_name",
            "remarks",
            "created_at",
        ]
        read_only_fields = (
            "teacher",
            "created_at",
        )


# ─────────────────────────────────────────
# STUDENT VIEW SERIALIZER
# ─────────────────────────────────────────

class StudentMarksSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name", read_only=True
    )
    course_name = serializers.CharField(
        source="subject.course.name", read_only=True
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
            "course_name",
            "subject_name",
            "marks",
            "teacher_name",
            "created_at",
        ]
