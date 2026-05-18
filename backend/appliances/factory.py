"""Factory pattern helper for appliance creation."""


class ApplianceFactory:
    """Creates appliance data with defaults based on appliance type."""

    DEFAULT_POWER_RATINGS = {
        "light": 60,
        "ac": 1500,
        "fridge": 200,
        "heater": 2000,
        "washing_machine": 800,
        "other": 100,
    }

    DEFAULT_ROOMS = {
        "light": "Living Room",
        "ac": "Bedroom",
        "fridge": "Kitchen",
        "heater": "Living Room",
        "washing_machine": "Utility Room",
        "other": "General",
    }

    @staticmethod
    def create_appliance_data(
        appliance_type,
        name=None,
        power_rating=None,
        room_location=None,
    ):
        return {
            "name": name or f"My {appliance_type.replace('_', ' ').title()}",
            "appliance_type": appliance_type,
            "power_rating": power_rating
            or ApplianceFactory.DEFAULT_POWER_RATINGS.get(appliance_type, 100),
            "room_location": room_location
            or ApplianceFactory.DEFAULT_ROOMS.get(appliance_type, "General"),
            "status": "off",
            "is_renewable_supported": appliance_type in ["light", "ac"],
        }
