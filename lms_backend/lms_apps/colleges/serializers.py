from rest_framework import serializers
from lms_apps.colleges.models import College


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = [
            "id",
            "name",
            "code",
            "status",
            "is_deleted",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
