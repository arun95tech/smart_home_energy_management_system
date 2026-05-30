# Appliance, schedule, and fault APIs
"""
Appliance views - CRUD for appliances, schedules, and fault reports.
Fault report mark-done uses PATCH with custom action.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from accounts.utils import get_request_user, is_admin, is_homeowner, is_technician
from energy.models import EnergyUsage, EnergyUsageSession
from .factory import ApplianceFactory
from .models import Appliance, ApplianceSchedule, FaultReport
from .serializers import ApplianceSerializer, ApplianceScheduleSerializer, FaultReportSerializer
# Appliance CRUD API


class ApplianceViewSet(viewsets.ModelViewSet):
    """Full CRUD for appliances. Homeowner field is required."""
    queryset = Appliance.objects.select_related('homeowner').all()
    serializer_class = ApplianceSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    # get_queryset function

    def get_queryset(self):
        """Optional filter by homeowner_id query param."""
        qs = super().get_queryset()
        homeowner_id = self.request.query_params.get('homeowner_id')
        if is_homeowner(self.request):
            return qs.filter(homeowner=get_request_user(self.request))
        if is_admin(self.request) or is_technician(self.request):
            if homeowner_id:
                qs = qs.filter(homeowner_id=homeowner_id)
            return qs
        return qs.none()
    # create function

    def create(self, request, *args, **kwargs):
        if not is_homeowner(request):
            return Response({'detail': 'Only homeowners can add appliances.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        if data.get('appliance_type'):
            factory_data = ApplianceFactory.create_appliance_data(
                data.get('appliance_type'),
                name=data.get('name'),
                power_rating=data.get('power_rating'),
                room_location=data.get('room_location'),
            )
            factory_data.update(data)
            data = factory_data
        data['homeowner'] = get_request_user(request).id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        appliance = serializer.instance
        if appliance.status == 'on' and not appliance.last_turned_on_at:
            appliance.last_turned_on_at = timezone.now()
            appliance.save(update_fields=['last_turned_on_at'])
        if appliance.status == 'faulty':
            from notifications.observers import handle_appliance_fault
            handle_appliance_fault(appliance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # partial_update function

    def partial_update(self, request, *args, **kwargs):
        appliance = self.get_object()
        user = get_request_user(request)
        if not is_homeowner(request) or appliance.homeowner_id != getattr(user, 'id', None):
            return Response({'detail': 'Only the appliance homeowner can update it.'}, status=status.HTTP_403_FORBIDDEN)

        previous_status = appliance.status
        response = super().partial_update(request, *args, **kwargs)
        appliance.refresh_from_db()
        self._handle_status_change(appliance, previous_status)
        return response
    # destroy function

    def destroy(self, request, *args, **kwargs):
        appliance = self.get_object()
        user = get_request_user(request)
        if not is_homeowner(request) or appliance.homeowner_id != getattr(user, 'id', None):
            return Response({'detail': 'Only the appliance homeowner can delete it.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    # _handle_status_change function

    def _handle_status_change(self, appliance, previous_status):
        now = timezone.now()
        if previous_status != 'on' and appliance.status == 'on':
            appliance.last_turned_on_at = now
            appliance.save(update_fields=['last_turned_on_at'])
            return

        if previous_status == 'on' and appliance.status != 'on' and appliance.last_turned_on_at:
            started = appliance.last_turned_on_at
            duration_minutes = max((now - started).total_seconds(), 0) / 60
            usage_kwh = round((appliance.power_rating / 1000) * (duration_minutes / 60), 4)
            estimated_cost = round(usage_kwh * 0.30, 2)
            EnergyUsage.objects.create(appliance=appliance, usage_kwh=usage_kwh)
            EnergyUsageSession.objects.create(
                appliance=appliance,
                homeowner=appliance.homeowner,
                started_at=started,
                ended_at=now,
                duration_minutes=round(duration_minutes, 2),
                usage_kwh=usage_kwh,
                estimated_cost=estimated_cost,
            )
            appliance.last_turned_on_at = None
            appliance.save(update_fields=['last_turned_on_at'])

        if appliance.status == 'faulty':
            from notifications.observers import handle_appliance_fault
            handle_appliance_fault(appliance)
# Appliance schedule API


class ApplianceScheduleViewSet(viewsets.ModelViewSet):
    queryset = ApplianceSchedule.objects.select_related('appliance').all()
    serializer_class = ApplianceScheduleSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    # get_queryset function

    def get_queryset(self):
        qs = super().get_queryset()
        if is_admin(self.request):
            return qs
        if is_homeowner(self.request):
            return qs.filter(appliance__homeowner=get_request_user(self.request))
        return qs.none()
    # create function

    def create(self, request, *args, **kwargs):
        if not is_homeowner(request):
            return Response({'detail': 'Only homeowners can create appliance schedules.'}, status=status.HTTP_403_FORBIDDEN)
        appliance_id = request.data.get('appliance')
        user = get_request_user(request)
        if not appliance_id or not Appliance.objects.filter(id=appliance_id, homeowner=user).exists():
            return Response({'detail': 'You can schedule only your own appliances.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)
    # partial_update function

    def partial_update(self, request, *args, **kwargs):
        schedule = self.get_object()
        if not is_homeowner(request) or schedule.appliance.homeowner_id != getattr(get_request_user(request), 'id', None):
            return Response({'detail': 'You can update only schedules for your own appliances.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)
    # destroy function

    def destroy(self, request, *args, **kwargs):
        schedule = self.get_object()
        if not is_homeowner(request) or schedule.appliance.homeowner_id != getattr(get_request_user(request), 'id', None):
            return Response({'detail': 'You can delete only schedules for your own appliances.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
# Fault report API


class FaultReportViewSet(viewsets.ModelViewSet):
    """CRUD for fault reports. Custom action for marking maintenance done."""
    queryset = FaultReport.objects.select_related('appliance', 'homeowner').all()
    serializer_class = FaultReportSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    # get_queryset function

    def get_queryset(self):
        qs = super().get_queryset()
        if is_admin(self.request) or is_technician(self.request):
            return qs
        if is_homeowner(self.request):
            return qs.filter(homeowner=get_request_user(self.request))
        return qs.none()
    # create function

    def create(self, request, *args, **kwargs):
        if not is_homeowner(request):
            return Response({'detail': 'Only homeowners can create fault reports.'}, status=status.HTTP_403_FORBIDDEN)
        appliance_id = request.data.get('appliance')
        user = get_request_user(request)
        if not appliance_id or not Appliance.objects.filter(id=appliance_id, homeowner=user).exists():
            return Response({'detail': 'You can report faults only for your own appliances.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['homeowner'] = user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    # partial_update function

    def partial_update(self, request, *args, **kwargs):
        if not is_admin(request):
            return Response({'detail': 'Use mark-done for technician fault completion.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)
    # destroy function

    def destroy(self, request, *args, **kwargs):
        if not is_admin(request):
            return Response({'detail': 'Only admins can delete fault reports.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    # Technician marks fault done

    @action(detail=True, methods=['patch'], url_path='mark-done')
    def mark_done(self, request, pk=None):
        """
        Technician marks a fault report as done.
        This also sets appliance status back to 'ok'.
        """
        fault_report = self.get_object()
        if not is_technician(request):
            return Response({'detail': 'Only technicians can mark faults as done.'}, status=status.HTTP_403_FORBIDDEN)

        if fault_report.status == 'done':
            return Response(
                {'message': 'This fault report is already marked as done.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        fault_report.mark_done()
        serializer = self.get_serializer(fault_report)
        return Response(serializer.data, status=status.HTTP_200_OK)
