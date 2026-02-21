from rest_framework import serializers
from lms_apps.accounts.models import User
from lms_apps.core.constants import UserRole
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# ─────────────────────────────────────────
# GENERAL USER SERIALIZER
# ─────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(
        source="college.name",
        read_only=True
    )
    college_id = serializers.IntegerField(
        source="college.id",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "is_active",
            "college_id",
            "college_name",
        ]

# ─────────────────────────────────────────
# COLLEGE ADMIN - CREATE USER
# ─────────────────────────────────────────

class CollegeUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "password",
        ]

    def validate_role(self, value):
        if value not in [
            UserRole.TEACHER,
            UserRole.STAFF,
            UserRole.STUDENT,
        ]:
            raise serializers.ValidationError("Invalid role for College Admin")
        return value

    def create(self, validated_data):
        college = self.context["request"].user.college
        password = validated_data.pop("password")

        user = User.objects.create(
            college=college,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


# ─────────────────────────────────────────
# JWT LOGIN SERIALIZER
# ─────────────────────────────────────────

class LoginTokenSerializer(TokenObtainPairSerializer):
    """
    Custom JWT login serializer
    Adds user role to login response
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        return data


# ─────────────────────────────────────────
# TEACHER → STUDENT LIST SERIALIZER
# ─────────────────────────────────────────

class StudentListSerializer(serializers.ModelSerializer):
    """
    Used in:
    /api/accounts/teacher-students/
    """

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
        ]
