from rest_framework import serializers
from lms_apps.colleges.models import College


class CollegeSerializer(serializers.ModelSerializer):
    # 🔥 Admin fields (not stored in College model)
    admin_name = serializers.CharField(write_only=True)
    admin_email = serializers.EmailField(write_only=True)
    admin_password = serializers.CharField(write_only=True)

    class Meta:
        model = College
        fields = [
            "id",
            "name",
            "code",
            "status",
            "created_at",

           
            "admin_name",
            "admin_email",
            "admin_password",
        ]
        read_only_fields = ["id", "created_at"]