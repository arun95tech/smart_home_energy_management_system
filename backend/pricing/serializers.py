# Pricing plan serializer
from rest_framework import serializers
from .models import PricingPlan
# PricingPlanSerializer section


class PricingPlanSerializer(serializers.ModelSerializer):
    # Meta section
    class Meta:
        model = PricingPlan
        fields = '__all__'
