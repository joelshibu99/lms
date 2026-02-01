from django.db import models
from lms_apps.core.models import TimeStampedModel


class College(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.code})"

    class Meta:
        app_label = "colleges"          # ✅ THIS LINE FIXES EVERYTHING
        db_table = "colleges"
        verbose_name = "College"
        verbose_name_plural = "Colleges"
