from django.db import models

from .strategies import PricingContext, get_pricing_strategy


class PricingPlan(models.Model):
    PLAN_TYPES = [
        ("flat", "Flat Rate"),
        ("peak", "Peak Hour"),
        ("green", "Green Energy"),
    ]

    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES, default="flat")
    rate_per_kwh = models.FloatField()
    discount_percentage = models.FloatField(default=0)
    is_active = models.BooleanField(default=True)

    def calculate_cost(self, usage_kwh, usage_time=None):
        strategy = get_pricing_strategy(self.plan_type)
        context = PricingContext(strategy)
        return context.calculate(
            usage_kwh,
            self.rate_per_kwh,
            self.discount_percentage,
            usage_time,
        )

    def __str__(self):
        return f"{self.name} ({self.plan_type})"
