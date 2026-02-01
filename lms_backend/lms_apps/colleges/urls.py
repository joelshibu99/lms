from rest_framework.routers import DefaultRouter
from lms_apps.colleges.views import CollegeViewSet

router = DefaultRouter()
router.register("colleges", CollegeViewSet, basename="colleges")

urlpatterns = router.urls
