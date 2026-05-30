# Pricing admin setup
from django.contrib import admin
from .models import PricingPlan
# PricingPlanAdmin section

@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan_type', 'rate_per_kwh', 'discount_percentage', 'is_active']
    list_filter = ['plan_type', 'is_active']
