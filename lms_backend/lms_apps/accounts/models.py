from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from lms_apps.core.models import TimeStampedModel
from lms_apps.core.constants import UserRole
from lms_apps.colleges.models import College
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
    )

    college = models.ForeignKey(
        College,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="users",
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email

    class Meta:
        app_label = "accounts" 
        db_table = "users"
