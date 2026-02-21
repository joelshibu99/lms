from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import make_password
from django.db import transaction

from lms_apps.colleges.models import College
from lms_apps.colleges.serializers import CollegeSerializer
from lms_apps.core.permissions import IsSystemAdmin
from lms_apps.accounts.models import User


class CollegeViewSet(ModelViewSet):
    queryset = College.objects.filter(is_deleted=False)
    serializer_class = CollegeSerializer
    permission_classes = [IsAuthenticated, IsSystemAdmin]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 🔹 Extract admin fields
        admin_name = serializer.validated_data.pop("admin_name")
        admin_email = serializer.validated_data.pop("admin_email")
        admin_password = serializer.validated_data.pop("admin_password")

        # 🔹 Create College
        college = College.objects.create(**serializer.validated_data)

        # 🔹 Create College Admin User
        User.objects.create(
            full_name=admin_name,
            email=admin_email,
            role="COLLEGE_ADMIN",
            college=college,
            password=make_password(admin_password),
        )

        return Response(
            {"detail": "College and Admin created successfully"},
            status=status.HTTP_201_CREATED,
        )

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()