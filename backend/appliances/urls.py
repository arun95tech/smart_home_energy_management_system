from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ApplianceScheduleViewSet, ApplianceViewSet, FaultReportViewSet


router = DefaultRouter()
router.register("appliances", ApplianceViewSet)
router.register("appliance-schedules", ApplianceScheduleViewSet)
router.register("fault-reports", FaultReportViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
