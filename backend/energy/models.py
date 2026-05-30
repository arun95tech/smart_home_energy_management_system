# Energy usage data models
"""
Energy app - tracks energy usage per appliance.
"""
from django.db import models
from django.contrib.auth.models import User
from appliances.models import Appliance
# EnergyUsage section


class EnergyUsage(models.Model):
    """Records how much energy an appliance used at a given time."""

    appliance = models.ForeignKey(
        Appliance, on_delete=models.CASCADE, related_name='energy_usage'
    )
    usage_kwh = models.FloatField()
    usage_date = models.DateField(auto_now_add=True)
    usage_time = models.TimeField(auto_now_add=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    # calculate_basic_cost function

    def calculate_basic_cost(self, rate):
        """Calculate the cost for this usage at a given rate per kWh."""
        return round(self.usage_kwh * rate, 2)
    # __str__ function

    def __str__(self):
        return f"{self.appliance.name}: {self.usage_kwh} kWh on {self.usage_date}"
# EnergyUsageSession section


class EnergyUsageSession(models.Model):
    appliance = models.ForeignKey(
        Appliance, on_delete=models.CASCADE, related_name='usage_sessions'
    )
    homeowner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage_sessions')
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField()
    duration_minutes = models.FloatField()
    usage_kwh = models.FloatField()
    estimated_cost = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    # __str__ function

    def __str__(self):
        return f"{self.appliance.name}: {self.usage_kwh} kWh session"
# DailyBill section


class DailyBill(models.Model):
    homeowner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_bills')
    bill_date = models.DateField()
    total_kwh = models.FloatField(default=0)
    total_cost = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    # Meta section

    class Meta:
        unique_together = ('homeowner', 'bill_date')
        ordering = ['-bill_date']
    # __str__ function

    def __str__(self):
        return f"{self.homeowner.username}: {self.bill_date} - {self.total_cost}"
