from rest_framework import serializers

from .models import EnergyUsage


class EnergyUsageSerializer(serializers.ModelSerializer):
    appliance_name = serializers.CharField(source="appliance.name", read_only=True)
    homeowner_username = serializers.CharField(
        source="appliance.homeowner.username",
        read_only=True,
    )
    homeowner_id = serializers.IntegerField(source="appliance.homeowner.id", read_only=True)

    class Meta:
        model = EnergyUsage
        fields = [
            "id",
            "appliance",
            "appliance_name",
            "homeowner_username",
            "homeowner_id",
            "usage_kwh",
            "usage_date",
            "usage_time",
            "recorded_at",
        ]
