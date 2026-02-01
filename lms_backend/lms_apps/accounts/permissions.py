from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    """
    Allows access only to users with TEACHER role
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "TEACHER"
        )


class IsStaff(BasePermission):
    """
    Allows access only to users with STAFF role
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "STAFF"
        )


class IsStudent(BasePermission):
    """
    Allows access only to users with STUDENT role
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "STUDENT"
        )

class IsCollegeAdmin(BasePermission):
    """
    Allows access only to users with COLLEGE_ADMIN role
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "COLLEGE_ADMIN"
        )


class IsSystemAdmin(BasePermission):
    """
    Allows access only to users with SYSTEM_ADMIN role
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "SYSTEM_ADMIN"
        )

