from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from lms_apps.colleges.models import College
from lms_apps.colleges.serializers import CollegeSerializer
from lms_apps.core.permissions import IsSystemAdmin


class CollegeViewSet(ModelViewSet):
    queryset = College.objects.filter(is_deleted=False)
    serializer_class = CollegeSerializer
    permission_classes = [IsAuthenticated, IsSystemAdmin]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
