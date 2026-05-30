# Singleton pattern used here
# Singleton Pattern: keeps dashboard summary logic in one shared manager.

from django.contrib.auth.models import User
from django.db.models import Sum
from django.utils import timezone
# Singleton pattern used here


class EnergyManagementSystem:
    _instance = None
    # __new__ function

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    # calculate_total_kwh function

    def calculate_total_kwh(self, homeowner):
        from energy.models import EnergyUsage
        result = EnergyUsage.objects.filter(
            appliance__homeowner=homeowner
        ).aggregate(total=Sum('usage_kwh'))
        return round(result['total'] or 0, 2)
    # calculate_live_kwh function

    def calculate_live_kwh(self, homeowner):
        from appliances.models import Appliance
        return round(sum(
            appliance.calculate_running_kwh()
            for appliance in Appliance.objects.filter(homeowner=homeowner, status='on')
        ), 4)
    # get_appliance_count function

    def get_appliance_count(self, homeowner):
        from appliances.models import Appliance
        return Appliance.objects.filter(homeowner=homeowner).count()
    # get_faulty_appliance_count function

    def get_faulty_appliance_count(self, homeowner):
        from appliances.models import Appliance
        return Appliance.objects.filter(homeowner=homeowner, status='faulty').count()
    # calculate_total_cost function

    def calculate_total_cost(self, homeowner):
        total_kwh = self.calculate_total_kwh(homeowner)
        profile = getattr(homeowner, 'profile', None)
        plan = getattr(profile, 'pricing_plan', None)
        if plan:
            return plan.calculate_cost(total_kwh)
        return round(total_kwh * 0.30, 2)
    # get_rate function

    def get_rate(self, homeowner):
        profile = getattr(homeowner, 'profile', None)
        plan = getattr(profile, 'pricing_plan', None)
        return {
            'plan_name': plan.name if plan else getattr(profile, 'plan_name', 'Standard Plan'),
            'plan_type': plan.plan_type if plan else 'flat',
            'rate_per_kwh': plan.rate_per_kwh if plan else 0.30,
        }
    # update_daily_bill function

    def update_daily_bill(self, homeowner):
        from energy.models import DailyBill, EnergyUsage
        today = timezone.localdate()
        usage = EnergyUsage.objects.filter(
            appliance__homeowner=homeowner,
            usage_date=today,
        ).aggregate(total=Sum('usage_kwh'))['total'] or 0
        usage = round(usage + self.calculate_live_kwh(homeowner), 4)
        rate = self.get_rate(homeowner)
        cost = round(usage * float(rate['rate_per_kwh']), 2)
        DailyBill.objects.update_or_create(
            homeowner=homeowner,
            bill_date=today,
            defaults={'total_kwh': usage, 'total_cost': cost},
        )
        return usage, cost
    # get_dashboard_summary function

    def get_dashboard_summary(self, homeowner):
        from appliances.models import Appliance
        from notifications.models import Notification
        from recommendations.models import Recommendation

        appliances = Appliance.objects.filter(homeowner=homeowner)

        live_kwh = self.calculate_live_kwh(homeowner)
        today_bill_kwh, today_bill_cost = self.update_daily_bill(homeowner)
        rate = self.get_rate(homeowner)
        total_kwh = self.calculate_total_kwh(homeowner)
        return {
            'homeowner_id': homeowner.id,
            'homeowner_username': homeowner.username,
            'total_appliances': appliances.count(),
            'active_appliances': appliances.filter(status='on').count(),
            'faulty_appliances': self.get_faulty_appliance_count(homeowner),
            'total_kwh': round(total_kwh + live_kwh, 4),
            'saved_kwh': round(appliances.filter(is_renewable_supported=True).count() * 0.5, 2),
            'live_kwh': live_kwh,
            'total_cost': self.calculate_total_cost(homeowner),
            'today_bill_kwh': today_bill_kwh,
            'today_bill_cost': today_bill_cost,
            **rate,
            'unread_notifications': Notification.objects.filter(
                recipient=homeowner, is_read=False
            ).count(),
            'total_notifications': Notification.objects.filter(recipient=homeowner).count(),
            'recommendations_count': Recommendation.objects.filter(homeowner=homeowner).count(),
            'appliance_status_summary': {
                'on': appliances.filter(status='on').count(),
                'off': appliances.filter(status='off').count(),
                'ok': appliances.filter(status='ok').count(),
                'faulty': appliances.filter(status='faulty').count(),
            },
            'status_counts': {
                'on': appliances.filter(status='on').count(),
                'off': appliances.filter(status='off').count(),
                'ok': appliances.filter(status='ok').count(),
                'faulty': appliances.filter(status='faulty').count(),
            },
        }
