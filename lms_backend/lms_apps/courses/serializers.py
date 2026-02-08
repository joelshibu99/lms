from rest_framework import serializers
from .models import Course, Enrollment


# ─────────────────────────────────────────
# Course Serializer (Admin / Student)
# ─────────────────────────────────────────
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "name",
            "is_active",
            "created_at",
        ]


# ─────────────────────────────────────────
# Student Enrolled Course Serializer
# ─────────────────────────────────────────
class EnrolledCourseSerializer(serializers.ModelSerializer):
    code = serializers.CharField(source="course.code")
    name = serializers.CharField(source="course.name")
    is_active = serializers.BooleanField(source="course.is_active")

    class Meta:
        model = Enrollment
        fields = [
            "code",
            "name",
            "is_active",
        ]
