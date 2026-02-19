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

