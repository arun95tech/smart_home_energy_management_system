"""Accounts app models."""
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    """Extended profile for each user with role and plan information."""

    ROLE_CHOICES = [
        ("homeowner", "Homeowner"),
        ("admin", "Admin"),
        ("technician", "Technician"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="homeowner")
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_active_member = models.BooleanField(default=True)
    plan_name = models.CharField(max_length=100, default="Standard Plan")
    plan_expiry_date = models.DateField(null=True, blank=True)

    def activate_member(self):
        self.is_active_member = True
        self.save()

    def deactivate_member(self):
        self.is_active_member = False
        self.save()

    def __str__(self):
        return f"{self.user.username} ({self.role})"
