from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PricingPlanViewSet, calculate_cost


router = DefaultRouter()
router.register("pricing-plans", PricingPlanViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("calculate-cost/", calculate_cost, name="calculate-cost"),
]
