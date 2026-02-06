from rest_framework import serializers
from .models import Course, Enrollment


# ─────────────────────────────────────────
# Course Serializer (Admin / Teacher use)
# ─────────────────────────────────────────
class CourseSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.email", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "name",
            "is_active",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
        ]


# ─────────────────────────────────────────
# Student Enrolled Course Serializer
# ─────────────────────────────────────────
class EnrolledCourseSerializer(serializers.ModelSerializer):
    # flatten course fields
    id = serializers.IntegerField(source="course.id")
    code = serializers.CharField(source="course.code")
    name = serializers.CharField(source="course.name")
    is_active = serializers.BooleanField(source="course.is_active")

    subject = serializers.IntegerField(source="course.subject.id")
    subject_name = serializers.CharField(source="course.subject.name")

    teacher = serializers.IntegerField(source="course.teacher.id", allow_null=True)
    teacher_name = serializers.CharField(
        source="course.teacher.email",
        allow_null=True
    )

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "code",
            "name",
            "is_active",
            "subject",
            "subject_name",
            "teacher",
            "teacher_name",
        ]
