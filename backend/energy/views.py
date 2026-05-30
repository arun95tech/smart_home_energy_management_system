# Energy usage APIs
from rest_framework import viewsets, status
from rest_framework.response import Response
from accounts.utils import get_request_user, is_admin, is_homeowner
from .models import DailyBill, EnergyUsage, EnergyUsageSession
from .serializers import DailyBillSerializer, EnergyUsageSerializer, EnergyUsageSessionSerializer
# Energy usage API


class EnergyUsageViewSet(viewsets.ModelViewSet):
    queryset = EnergyUsage.objects.select_related('appliance__homeowner').all()
    serializer_class = EnergyUsageSerializer
    # get_queryset function

    def get_queryset(self):
        qs = super().get_queryset()
        homeowner_id = self.request.query_params.get('homeowner_id')
        appliance_id = self.request.query_params.get('appliance_id')
        if is_homeowner(self.request):
            user = get_request_user(self.request)
            qs = qs.filter(appliance__homeowner=user)
        elif is_admin(self.request):
            if homeowner_id:
                qs = qs.filter(appliance__homeowner_id=homeowner_id)
        else:
            return qs.none()
        if appliance_id:
            qs = qs.filter(appliance_id=appliance_id)
        return qs
    # create function

    def create(self, request, *args, **kwargs):
        if not is_homeowner(request):
            return Response({'detail': 'Only homeowners can add energy usage.'}, status=status.HTTP_403_FORBIDDEN)
        appliance_id = request.data.get('appliance')
        user = get_request_user(request)
        if not appliance_id or not user.appliances.filter(id=appliance_id).exists():
            return Response({'detail': 'You can record usage only for your own appliances.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
    # perform_create function

    def perform_create(self, serializer):
        instance = serializer.save()
        # Observer Pattern: notify homeowner when usage is unusually high.
        if instance.usage_kwh > 10:
            from notifications.observers import handle_high_usage
            handle_high_usage(instance)
# Energy usage session API


class EnergyUsageSessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EnergyUsageSession.objects.select_related('appliance', 'homeowner').all()
    serializer_class = EnergyUsageSessionSerializer
    # get_queryset function

    def get_queryset(self):
        qs = super().get_queryset()
        homeowner_id = self.request.query_params.get('homeowner_id')
        if is_homeowner(self.request):
            return qs.filter(homeowner=get_request_user(self.request))
        if is_admin(self.request):
            if homeowner_id:
                qs = qs.filter(homeowner_id=homeowner_id)
            return qs
        return qs.none()
# Daily bill API


class DailyBillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyBill.objects.select_related('homeowner').all()
    serializer_class = DailyBillSerializer
    # get_queryset function

    def get_queryset(self):
        qs = super().get_queryset()
        homeowner_id = self.request.query_params.get('homeowner_id')
        if is_homeowner(self.request):
            return qs.filter(homeowner=get_request_user(self.request))
        if is_admin(self.request):
            if homeowner_id:
                qs = qs.filter(homeowner_id=homeowner_id)
            return qs
        return qs.none()
