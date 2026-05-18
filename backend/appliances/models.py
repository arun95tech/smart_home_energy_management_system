"""
Appliances app - Appliance, ApplianceSchedule, FaultReport models.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Appliance(models.Model):
    """Represents a home appliance owned by a homeowner."""

    TYPE_CHOICES = [
        ('light', 'Light'),
        ('ac', 'Air Conditioner'),
        ('fridge', 'Refrigerator'),
        ('heater', 'Heater'),
        ('washing_machine', 'Washing Machine'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('on', 'On'),
        ('off', 'Off'),
        ('ok', 'OK'),
        ('faulty', 'Faulty'),
    ]

    homeowner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='appliances'
    )
    name = models.CharField(max_length=100)
    appliance_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='other')
    power_rating = models.FloatField(help_text='Power rating in watts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='off')
    room_location = models.CharField(max_length=100, blank=True)
    is_renewable_supported = models.BooleanField(default=False)
    last_turned_on_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_running_kwh(self, now=None):
        if self.status != 'on' or not self.last_turned_on_at:
            return 0
        now = now or timezone.now()
        elapsed_hours = max((now - self.last_turned_on_at).total_seconds(), 0) / 3600
        return round((self.power_rating / 1000) * elapsed_hours, 4)

    def turn_on(self):
        """Turn the appliance on."""
        if self.status != 'on':
            self.last_turned_on_at = timezone.now()
        self.status = 'on'
        self.save()

    def turn_off(self):
        """Turn the appliance off."""
        self.last_turned_on_at = None
        self.status = 'off'
        self.save()

    def mark_faulty(self):
        """Mark the appliance as faulty and trigger observer."""
        self.last_turned_on_at = None
        self.status = 'faulty'
        self.save()
        # Observer pattern: trigger fault handling
        from notifications.observers import handle_appliance_fault
        handle_appliance_fault(self)

    def __str__(self):
        return f"{self.name} ({self.homeowner.username})"


class ApplianceSchedule(models.Model):
    """Schedule for when an appliance should be on/off."""
    appliance = models.ForeignKey(
        Appliance, on_delete=models.CASCADE, related_name='schedules'
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    repeat_daily = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.appliance.name}: {self.start_time} - {self.end_time}"


class FaultReport(models.Model):
    """Records a fault reported for an appliance."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('done', 'Done'),
    ]

    appliance = models.ForeignKey(
        Appliance, on_delete=models.CASCADE, related_name='fault_reports'
    )
    homeowner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='fault_reports'
    )
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reported_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def mark_done(self):
        """
        Mark this fault report as done.
        Also sets the appliance status back to 'ok'.
        """
        from django.utils import timezone
        self.status = 'done'
        self.completed_at = timezone.now()
        self.save()

        # Reset appliance status to ok
        self.appliance.status = 'ok'
        self.appliance.save()

    def __str__(self):
        return f"Fault: {self.appliance.name} - {self.status}"
