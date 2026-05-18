"""Appliance models."""
from django.contrib.auth.models import User
from django.db import models


class Appliance(models.Model):
    """A home appliance owned by a homeowner."""

    TYPE_CHOICES = [
        ("light", "Light"),
        ("ac", "Air Conditioner"),
        ("fridge", "Refrigerator"),
        ("heater", "Heater"),
        ("washing_machine", "Washing Machine"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("on", "On"),
        ("off", "Off"),
        ("ok", "OK"),
        ("faulty", "Faulty"),
    ]

    homeowner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appliances")
    name = models.CharField(max_length=100)
    appliance_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default="other")
    power_rating = models.FloatField(help_text="Power rating in watts")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="off")
    room_location = models.CharField(max_length=100, blank=True)
    is_renewable_supported = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def turn_on(self):
        self.status = "on"
        self.save()

    def turn_off(self):
        self.status = "off"
        self.save()

    def mark_faulty(self):
        self.status = "faulty"
        self.save()
        from notifications.observers import handle_appliance_fault

        handle_appliance_fault(self)

    def __str__(self):
        return f"{self.name} ({self.homeowner.username})"


class ApplianceSchedule(models.Model):
    """Schedule for when an appliance should run."""

    appliance = models.ForeignKey(
        Appliance,
        on_delete=models.CASCADE,
        related_name="schedules",
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    repeat_daily = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.appliance.name}: {self.start_time} - {self.end_time}"


class FaultReport(models.Model):
    """Fault reported for an appliance."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("done", "Done"),
    ]

    appliance = models.ForeignKey(
        Appliance,
        on_delete=models.CASCADE,
        related_name="fault_reports",
    )
    homeowner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fault_reports")
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reported_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def mark_done(self):
        from django.utils import timezone

        self.status = "done"
        self.completed_at = timezone.now()
        self.save()

        self.appliance.status = "ok"
        self.appliance.save()

    def __str__(self):
        return f"Fault: {self.appliance.name} - {self.status}"
