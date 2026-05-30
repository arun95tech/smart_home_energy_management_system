# Strategy pattern used here
# Strategy Pattern: each class calculates electricity cost in a different way.
# Strategy pattern base class


class PricingStrategy:
    # Calculate electricity cost API
    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        raise NotImplementedError("Subclasses must implement calculate_cost")
# Flat rate pricing strategy


class FlatRateStrategy(PricingStrategy):
    # Calculate electricity cost API
    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        base_cost = usage_kwh * rate_per_kwh
        discount = base_cost * (discount_percentage / 100)
        return round(base_cost - discount, 4)
# Peak hour pricing strategy


class PeakHourStrategy(PricingStrategy):
    # Calculate electricity cost API
    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        multiplier = 1.0

        if usage_time:
            if isinstance(usage_time, str):
                try:
                    hour = int(usage_time.split(':')[0])
                except (ValueError, IndexError):
                    hour = 12
            else:
                hour = usage_time.hour

            if 17 <= hour < 21:
                multiplier = 1.5
            elif 0 <= hour < 6:
                multiplier = 0.8

        base_cost = usage_kwh * rate_per_kwh * multiplier
        discount = base_cost * (discount_percentage / 100)
        return round(base_cost - discount, 4)
# Green energy pricing strategy


class GreenEnergyStrategy(PricingStrategy):
    GREEN_DISCOUNT = 10
    # Calculate electricity cost API

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        base_cost = usage_kwh * rate_per_kwh
        total_discount_pct = discount_percentage + self.GREEN_DISCOUNT
        discount = base_cost * (total_discount_pct / 100)
        return round(base_cost - discount, 4)
# Strategy context chooses calculation


class PricingContext:
    # __init__ function
    def __init__(self, strategy: PricingStrategy):
        self._strategy = strategy
    # calculate function

    def calculate(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        return self._strategy.calculate_cost(usage_kwh, rate_per_kwh, discount_percentage, usage_time)
# Select pricing strategy


def get_pricing_strategy(plan_type: str) -> PricingStrategy:
    strategies = {
        'flat': FlatRateStrategy(),
        'peak': PeakHourStrategy(),
        'green': GreenEnergyStrategy(),
    }
    return strategies.get(plan_type, FlatRateStrategy())
