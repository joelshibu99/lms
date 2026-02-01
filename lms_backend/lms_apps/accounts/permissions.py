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
