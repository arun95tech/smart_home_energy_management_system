from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .energy_manager import EnergyManagementSystem


@api_view(["GET"])
def dashboard_summary(request, homeowner_id):
    try:
        homeowner = User.objects.get(id=homeowner_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    energy_manager = EnergyManagementSystem()
    summary = energy_manager.get_dashboard_summary(homeowner)
    return Response(summary)


@api_view(["GET"])
def admin_dashboard_summary(request):
    from appliances.models import Appliance, FaultReport
    from energy.models import EnergyUsage
    from notifications.models import Notification
    from pricing.models import PricingPlan

    total_users = User.objects.count()
    total_appliances = Appliance.objects.count()
    active_plans = PricingPlan.objects.filter(is_active=True).count()
    total_notifications = Notification.objects.count()
    unread_notifications = Notification.objects.filter(is_read=False).count()

    total_kwh_result = EnergyUsage.objects.aggregate(total=Sum("usage_kwh"))
    total_kwh = round(total_kwh_result["total"] or 0, 2)
    total_cost = round(total_kwh * 0.30, 2)

    pending_faults = FaultReport.objects.filter(status="pending").count()
    done_faults = FaultReport.objects.filter(status="done").count()

    return Response(
        {
            "total_users": total_users,
            "total_appliances": total_appliances,
            "active_pricing_plans": active_plans,
            "total_notifications": total_notifications,
            "unread_notifications": unread_notifications,
            "total_kwh": total_kwh,
            "total_cost": total_cost,
            "pending_faults": pending_faults,
            "done_faults": done_faults,
        }
    )
