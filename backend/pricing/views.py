from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import PricingPlan
from .serializers import PricingPlanSerializer


class PricingPlanViewSet(viewsets.ModelViewSet):
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer


@api_view(["POST"])
def calculate_cost(request):
    pricing_plan_id = request.data.get("pricing_plan_id")
    usage_kwh = request.data.get("usage_kwh")
    usage_time = request.data.get("usage_time")

    if not pricing_plan_id or usage_kwh is None:
        return Response(
            {"error": "pricing_plan_id and usage_kwh are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        plan = PricingPlan.objects.get(id=pricing_plan_id)
    except PricingPlan.DoesNotExist:
        return Response({"error": "Pricing plan not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        usage_kwh = float(usage_kwh)
    except (ValueError, TypeError):
        return Response({"error": "usage_kwh must be a number."}, status=status.HTTP_400_BAD_REQUEST)

    cost = plan.calculate_cost(usage_kwh, usage_time)

    return Response(
        {
            "plan_name": plan.name,
            "plan_type": plan.plan_type,
            "usage_kwh": usage_kwh,
            "rate_per_kwh": plan.rate_per_kwh,
            "discount_percentage": plan.discount_percentage,
            "calculated_cost": cost,
            "usage_time": usage_time or "N/A",
        }
    )
