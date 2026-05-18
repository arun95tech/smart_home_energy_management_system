from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Appliance, ApplianceSchedule, FaultReport
from .serializers import (
    ApplianceScheduleSerializer,
    ApplianceSerializer,
    FaultReportSerializer,
)


class ApplianceViewSet(viewsets.ModelViewSet):
    """CRUD API for appliances."""

    queryset = Appliance.objects.select_related("homeowner").all()
    serializer_class = ApplianceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        homeowner_id = self.request.query_params.get("homeowner_id")
        if homeowner_id:
            queryset = queryset.filter(homeowner_id=homeowner_id)
        return queryset


class ApplianceScheduleViewSet(viewsets.ModelViewSet):
    """CRUD API for appliance schedules."""

    queryset = ApplianceSchedule.objects.select_related("appliance").all()
    serializer_class = ApplianceScheduleSerializer


class FaultReportViewSet(viewsets.ModelViewSet):
    """CRUD API for appliance fault reports."""

    queryset = FaultReport.objects.select_related("appliance", "homeowner").all()
    serializer_class = FaultReportSerializer
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    @action(detail=True, methods=["patch"], url_path="mark-done")
    def mark_done(self, request, pk=None):
        fault_report = self.get_object()

        if fault_report.status == "done":
            return Response(
                {"message": "This fault report is already marked as done."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        fault_report.mark_done()
        serializer = self.get_serializer(fault_report)
        return Response(serializer.data, status=status.HTTP_200_OK)
