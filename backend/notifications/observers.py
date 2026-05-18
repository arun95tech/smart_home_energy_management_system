"""
Observer Pattern for notifications.
These functions are called when certain events happen (high energy usage, appliance fault).
"""
from django.contrib.auth.models import User


def handle_high_usage(energy_usage_instance):
    """
    Observer: called when energy usage > 10 kWh.
    Creates a high_usage notification for the appliance homeowner.
    """
    from notifications.models import Notification

    homeowner = energy_usage_instance.appliance.homeowner
    appliance_name = energy_usage_instance.appliance.name

    Notification.objects.create(
        recipient=homeowner,
        notification_type='high_usage',
        message=(
            f"High energy usage detected! {appliance_name} used "
            f"{energy_usage_instance.usage_kwh} kWh, which exceeds the 10 kWh threshold."
        )
    )


def handle_appliance_fault(appliance_instance):
    """
    Observer: called when an appliance is marked faulty.
    1. Creates a FaultReport (pending) if none exists already.
    2. Notifies all technicians.
    """
    from appliances.models import FaultReport
    from notifications.models import Notification

    # Create a pending fault report if one doesn't exist
    existing_report = FaultReport.objects.filter(
        appliance=appliance_instance,
        status='pending'
    ).first()

    if not existing_report:
        FaultReport.objects.create(
            appliance=appliance_instance,
            homeowner=appliance_instance.homeowner,
            message=f"Appliance '{appliance_instance.name}' has been marked as faulty.",
            status='pending'
        )

    # Notify all technicians about the fault
    technicians = User.objects.filter(profile__role='technician')
    for technician in technicians:
        Notification.objects.create(
            recipient=technician,
            notification_type='fault',
            message=(
                f"Fault Alert: {appliance_instance.name} "
                f"(owned by {appliance_instance.homeowner.username}) "
                f"has been marked as faulty. Please check it."
            )
        )
