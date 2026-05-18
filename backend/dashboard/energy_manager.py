class EnergyManagementSystem:
    """Singleton class that aggregates dashboard data for a homeowner."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def calculate_total_kwh(self, homeowner):
        from django.db.models import Sum
        from energy.models import EnergyUsage

        result = EnergyUsage.objects.filter(appliance__homeowner=homeowner).aggregate(
            total=Sum("usage_kwh")
        )
        return round(result["total"] or 0, 2)

    def get_appliance_count(self, homeowner):
        from appliances.models import Appliance

        return Appliance.objects.filter(homeowner=homeowner).count()

    def get_faulty_appliance_count(self, homeowner):
        from appliances.models import Appliance

        return Appliance.objects.filter(homeowner=homeowner, status="faulty").count()

    def calculate_total_cost(self, homeowner):
        total_kwh = self.calculate_total_kwh(homeowner)
        return round(total_kwh * 0.30, 2)

    def get_dashboard_summary(self, homeowner):
        from appliances.models import Appliance
        from notifications.models import Notification
        from recommendations.models import Recommendation

        appliances = Appliance.objects.filter(homeowner=homeowner)

        return {
            "homeowner_id": homeowner.id,
            "homeowner_username": homeowner.username,
            "total_appliances": appliances.count(),
            "active_appliances": appliances.filter(status="on").count(),
            "faulty_appliances": self.get_faulty_appliance_count(homeowner),
            "total_kwh": self.calculate_total_kwh(homeowner),
            "total_cost": self.calculate_total_cost(homeowner),
            "unread_notifications": Notification.objects.filter(
                recipient=homeowner,
                is_read=False,
            ).count(),
            "total_notifications": Notification.objects.filter(recipient=homeowner).count(),
            "recommendations_count": Recommendation.objects.filter(homeowner=homeowner).count(),
            "appliance_status_summary": {
                "on": appliances.filter(status="on").count(),
                "off": appliances.filter(status="off").count(),
                "ok": appliances.filter(status="ok").count(),
                "faulty": appliances.filter(status="faulty").count(),
            },
        }
