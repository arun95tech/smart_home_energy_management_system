# Energy API routes
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyBillViewSet, EnergyUsageSessionViewSet, EnergyUsageViewSet

router = DefaultRouter()
router.register(r'energy-usage', EnergyUsageViewSet)
router.register(r'energy-usage-sessions', EnergyUsageSessionViewSet)
router.register(r'daily-bills', DailyBillViewSet)

urlpatterns = [path('', include(router.urls))]
