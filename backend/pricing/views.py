# Pricing plan and cost APIs
"""
Pricing views - CRUD for plans + cost calculator endpoint.
Uses Strategy Pattern for cost calculation.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.utils import is_admin
from .models import PricingPlan
from .serializers import PricingPlanSerializer
# Pricing plan management API


class PricingPlanViewSet(viewsets.ModelViewSet):
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer
    # create function

    def create(self, request, *args, **kwargs):
        if not is_admin(request):
            return Response({'detail': 'Only admins can create pricing plans.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
    # update function

    def update(self, request, *args, **kwargs):
        if not is_admin(request):
            return Response({'detail': 'Only admins can update pricing plans.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    # partial_update function

    def partial_update(self, request, *args, **kwargs):
        if not is_admin(request):
            return Response({'detail': 'Only admins can update pricing plans.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)
    # destroy function

    def destroy(self, request, *args, **kwargs):
        if not is_admin(request):
            return Response({'detail': 'Only admins can delete pricing plans.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
# Calculate electricity cost API


@api_view(['POST'])
def calculate_cost(request):
    """
    POST /api/calculate-cost/
    Demonstrates the Strategy Pattern for pricing.
    """
    pricing_plan_id = request.data.get('pricing_plan_id')
    usage_kwh = request.data.get('usage_kwh')
    usage_time = request.data.get('usage_time')
    usage_start_time = request.data.get('usage_start_time')
    usage_end_time = request.data.get('usage_end_time')

    if not pricing_plan_id or usage_kwh is None:
        return Response(
            {'error': 'pricing_plan_id and usage_kwh are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        plan = PricingPlan.objects.get(id=pricing_plan_id)
    except PricingPlan.DoesNotExist:
        return Response({'error': 'Pricing plan not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        usage_kwh = float(usage_kwh)
    except (ValueError, TypeError):
        return Response({'error': 'usage_kwh must be a number.'}, status=status.HTTP_400_BAD_REQUEST)

    calculation_time = usage_start_time or usage_time
    cost = plan.calculate_cost(usage_kwh, calculation_time)

    return Response({
        'plan_name': plan.name,
        'plan_type': plan.plan_type,
        'usage_kwh': usage_kwh,
        'rate_per_kwh': plan.rate_per_kwh,
        'discount_percentage': plan.discount_percentage,
        'calculated_cost': cost,
        'usage_time': calculation_time or 'N/A',
        'usage_start_time': usage_start_time or 'N/A',
        'usage_end_time': usage_end_time or 'N/A',
    })
