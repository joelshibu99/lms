from django.db import models


class UserRole(models.TextChoices):
    SYSTEM_ADMIN = "SYSTEM_ADMIN", "System Admin"
    COLLEGE_ADMIN = "COLLEGE_ADMIN", "College Admin"
    TEACHER = "TEACHER", "Teacher"
    STAFF = "STAFF", "Staff"
    STUDENT = "STUDENT", "Student"
