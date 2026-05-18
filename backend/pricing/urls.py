from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PricingPlanViewSet, calculate_cost

router = DefaultRouter()
router.register(r'pricing-plans', PricingPlanViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('calculate-cost/', calculate_cost, name='calculate-cost'),
]
