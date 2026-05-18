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
from .models import Appliance, ApplianceSchedule, FaultReport
from .serializers import ApplianceSerializer, ApplianceScheduleSerializer, FaultReportSerializer


class ApplianceViewSet(viewsets.ModelViewSet):
    """Full CRUD for appliances. Homeowner field is required."""
    queryset = Appliance.objects.select_related('homeowner').all()
    serializer_class = ApplianceSerializer

    def get_queryset(self):
        """Optional filter by homeowner_id query param."""
        qs = super().get_queryset()
        homeowner_id = self.request.query_params.get('homeowner_id')
        if homeowner_id:
            qs = qs.filter(homeowner_id=homeowner_id)
        if is_homeowner(self.request):
            qs = qs.filter(homeowner=get_request_user(self.request))
        return qs

    def create(self, request, *args, **kwargs):
        if not is_homeowner(request):
            return Response({'detail': 'Only homeowners can add appliances.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
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

    def destroy(self, request, *args, **kwargs):
        appliance = self.get_object()
        user = get_request_user(request)
        if not is_homeowner(request) or appliance.homeowner_id != getattr(user, 'id', None):
            return Response({'detail': 'Only the appliance homeowner can delete it.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

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


class ApplianceScheduleViewSet(viewsets.ModelViewSet):
    queryset = ApplianceSchedule.objects.select_related('appliance').all()
    serializer_class = ApplianceScheduleSerializer


class FaultReportViewSet(viewsets.ModelViewSet):
    """CRUD for fault reports. Custom action for marking maintenance done."""
    queryset = FaultReport.objects.select_related('appliance', 'homeowner').all()
    serializer_class = FaultReportSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

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
