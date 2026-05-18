"""
Factory Pattern for appliance creation.
Sets sensible defaults based on appliance type.
"""


class ApplianceFactory:
    """Creates appliance data with defaults based on type."""

    # Default power ratings (watts) per appliance type
    DEFAULT_POWER_RATINGS = {
        'light': 60,
        'ac': 1500,
        'fridge': 200,
        'heater': 2000,
        'washing_machine': 800,
        'other': 100,
    }

    # Default room locations per type
    DEFAULT_ROOMS = {
        'light': 'Living Room',
        'ac': 'Bedroom',
        'fridge': 'Kitchen',
        'heater': 'Living Room',
        'washing_machine': 'Utility Room',
        'other': 'General',
    }

    @staticmethod
    def create_appliance_data(appliance_type, name=None, power_rating=None, room_location=None):
        """
        Returns a dict of appliance field defaults based on type.
        The view can override any field after getting these defaults.
        """
        return {
            'name': name or f"My {appliance_type.replace('_', ' ').title()}",
            'appliance_type': appliance_type,
            'power_rating': power_rating or ApplianceFactory.DEFAULT_POWER_RATINGS.get(appliance_type, 100),
            'room_location': room_location or ApplianceFactory.DEFAULT_ROOMS.get(appliance_type, 'General'),
            'status': 'off',
            'is_renewable_supported': appliance_type in ['light', 'ac'],
        }
