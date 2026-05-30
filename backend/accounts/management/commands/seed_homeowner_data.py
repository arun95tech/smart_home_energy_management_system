# Homeowner sample data command
from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
# Management command


class Command(BaseCommand):
    help = 'Adds appliances, notifications, recommendations, and fault data for all homeowners.'

    APPLIANCES = [
        ('Living Room AC', 'ac', 1500, 'Living Room', True),
        ('Kitchen Fridge', 'fridge', 220, 'Kitchen', False),
        ('Bedroom Heater', 'heater', 1800, 'Bedroom', False),
        ('Hall Light', 'light', 60, 'Hallway', True),
        ('Washing Machine', 'washing_machine', 850, 'Utility Room', False),
        ('Solar Inverter', 'other', 3000, 'Rooftop', True),
        ('Study Lamp', 'light', 45, 'Study Room', True),
        ('Dishwasher', 'other', 1200, 'Kitchen', False),
        ('Water Pump', 'other', 750, 'Garage', False),
        ('Smart TV', 'other', 180, 'Living Room', False),
        ('Air Purifier', 'other', 95, 'Bedroom', True),
        ('Microwave Oven', 'other', 1100, 'Kitchen', False),
    ]

    FAULTY_TARGETS = {
        'Arun': 'Washing Machine',
        'priya': 'Living Room AC',
        'rohan': 'Bedroom Heater',
    }
    # handle function

    def handle(self, *args, **options):
        from appliances.models import Appliance, FaultReport
        from energy.models import EnergyUsage
        from notifications.models import Notification
        from recommendations.models import Recommendation

        homeowners = User.objects.filter(profile__role='homeowner').order_by('username')
        technicians = User.objects.filter(profile__role='technician')

        if not homeowners.exists():
            self.stdout.write(self.style.WARNING('No homeowners found. Run setup_real_credentials first.'))
            return

        # Keep total faulty status controlled at exactly three.
        Appliance.objects.filter(homeowner__profile__role='homeowner', status='faulty').update(status='off')

        created_count = 0
        for homeowner in homeowners:
            for index, (name, appliance_type, power, room, renewable) in enumerate(self.APPLIANCES):
                status = 'on' if index in (0, 1, 3) else 'off'
                if self.FAULTY_TARGETS.get(homeowner.username) == name:
                    status = 'faulty'

                appliance, created = Appliance.objects.update_or_create(
                    homeowner=homeowner,
                    name=name,
                    defaults={
                        'appliance_type': appliance_type,
                        'power_rating': power,
                        'room_location': room,
                        'is_renewable_supported': renewable,
                        'status': status,
                    },
                )
                created_count += int(created)

                if status == 'faulty':
                    FaultReport.objects.get_or_create(
                        appliance=appliance,
                        status='pending',
                        defaults={
                            'homeowner': homeowner,
                            'message': f"{name} has been marked as faulty and needs technician support.",
                        },
                    )
                    Notification.objects.get_or_create(
                        recipient=homeowner,
                        notification_type='fault',
                        message=f"Fault alert: {name} is faulty. A technician has been notified.",
                        defaults={'is_read': False},
                    )
                    for technician in technicians:
                        Notification.objects.get_or_create(
                            recipient=technician,
                            notification_type='fault',
                            message=f"Fault alert: {name} owned by {homeowner.username} needs attention.",
                            defaults={'is_read': False},
                        )

        arun = User.objects.filter(username='Arun', profile__role='homeowner').first()
        if arun:
            arun_appliances = {
                appliance.name: appliance
                for appliance in Appliance.objects.filter(homeowner=arun)
            }

            high_usage_rows = [
                ('Living Room AC', 13.8, date.today()),
                ('Bedroom Heater', 11.6, date.today() - timedelta(days=1)),
                ('Microwave Oven', 10.9, date.today() - timedelta(days=2)),
            ]
            for appliance_name, usage_kwh, usage_date in high_usage_rows:
                appliance = arun_appliances.get(appliance_name)
                if not appliance:
                    continue
                EnergyUsage.objects.get_or_create(
                    appliance=appliance,
                    usage_date=usage_date,
                    usage_kwh=usage_kwh,
                )
                Notification.objects.get_or_create(
                    recipient=arun,
                    notification_type='high_usage',
                    message=f"High usage detected: {appliance_name} used {usage_kwh} kWh.",
                    defaults={'is_read': False},
                )

            recommendations = [
                ('Shift laundry to off-peak hours', 'Run the washing machine after peak hours to reduce billing impact.', 9.50),
                ('Reduce AC runtime', 'Set the AC to 24C and use timer mode during evening hours.', 14.00),
                ('Replace older bulbs', 'Use LED bulbs in hall and study areas to lower lighting usage.', 6.25),
                ('Unplug standby devices', 'Switch off TV and microwave standby power when not in use.', 4.75),
                ('Use solar-supported devices first', 'Prioritise renewable-supported appliances during daylight hours.', 11.00),
            ]
            for title, description, saving in recommendations:
                Recommendation.objects.get_or_create(
                    homeowner=arun,
                    title=title,
                    defaults={'description': description, 'estimated_saving': saving},
                )
                Notification.objects.get_or_create(
                    recipient=arun,
                    notification_type='recommendation',
                    message=f"New recommendation: {title}",
                    defaults={'is_read': False},
                )

        total_appliances = Appliance.objects.filter(homeowner__profile__role='homeowner').count()
        faulty_count = Appliance.objects.filter(homeowner__profile__role='homeowner', status='faulty').count()
        self.stdout.write(self.style.SUCCESS(
            f'Homeowner data ready. Total appliances: {total_appliances}. '
            f'New appliances created: {created_count}. Faulty appliances: {faulty_count}.'
        ))
