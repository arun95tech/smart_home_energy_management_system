# Appliance API routes
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplianceViewSet, ApplianceScheduleViewSet, FaultReportViewSet

router = DefaultRouter()
router.register(r'appliances', ApplianceViewSet)
router.register(r'appliance-schedules', ApplianceScheduleViewSet)
router.register(r'fault-reports', FaultReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
