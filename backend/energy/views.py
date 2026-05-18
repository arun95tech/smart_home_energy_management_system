from rest_framework import viewsets

from .models import EnergyUsage
from .serializers import EnergyUsageSerializer


class EnergyUsageViewSet(viewsets.ModelViewSet):
    """CRUD API for appliance energy usage records."""

    queryset = EnergyUsage.objects.select_related("appliance__homeowner").all()
    serializer_class = EnergyUsageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        homeowner_id = self.request.query_params.get("homeowner_id")
        appliance_id = self.request.query_params.get("appliance_id")

        if homeowner_id:
            queryset = queryset.filter(appliance__homeowner_id=homeowner_id)
        if appliance_id:
            queryset = queryset.filter(appliance_id=appliance_id)

        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
        if instance.usage_kwh > 10:
            from notifications.observers import handle_high_usage

            handle_high_usage(instance)
