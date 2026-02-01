from rest_framework.permissions import BasePermission
from lms_apps.core.constants import UserRole


class IsSystemAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.SYSTEM_ADMIN
        )


class IsCollegeAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.COLLEGE_ADMIN
        )
