"""Energy usage models."""
from django.db import models

from appliances.models import Appliance


class EnergyUsage(models.Model):
    """Energy used by an appliance at a recorded time."""

    appliance = models.ForeignKey(
        Appliance,
        on_delete=models.CASCADE,
        related_name="energy_usage",
    )
    usage_kwh = models.FloatField()
    usage_date = models.DateField(auto_now_add=True)
    usage_time = models.TimeField(auto_now_add=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def calculate_basic_cost(self, rate):
        return round(self.usage_kwh * rate, 2)

    def __str__(self):
        return f"{self.appliance.name}: {self.usage_kwh} kWh on {self.usage_date}"
