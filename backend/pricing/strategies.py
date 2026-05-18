"""
Strategy Pattern for pricing calculations.
Each strategy implements a different cost calculation approach.
"""


class PricingStrategy:
    """Base strategy - subclasses override calculate_cost."""

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        raise NotImplementedError("Subclasses must implement calculate_cost")


class FlatRateStrategy(PricingStrategy):
    """Flat rate: cost = kWh × rate, minus discount."""

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        base_cost = usage_kwh * rate_per_kwh
        discount = base_cost * (discount_percentage / 100)
        return round(base_cost - discount, 4)


class PeakHourStrategy(PricingStrategy):
    """
    Peak hour pricing:
    - Peak (17:00–21:00): 1.5x multiplier
    - Off-peak (00:00–06:00): 0.8x multiplier
    - Otherwise: standard rate
    """

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        multiplier = 1.0

        if usage_time:
            # Parse time string "HH:MM" or time object
            if isinstance(usage_time, str):
                try:
                    hour = int(usage_time.split(':')[0])
                except (ValueError, IndexError):
                    hour = 12
            else:
                hour = usage_time.hour

            if 17 <= hour < 21:
                multiplier = 1.5  # Peak hours - more expensive
            elif 0 <= hour < 6:
                multiplier = 0.8  # Off-peak - cheaper

        base_cost = usage_kwh * rate_per_kwh * multiplier
        discount = base_cost * (discount_percentage / 100)
        return round(base_cost - discount, 4)


class GreenEnergyStrategy(PricingStrategy):
    """Green energy plan: applies a renewable discount on top of normal rate."""

    GREEN_DISCOUNT = 10  # Extra 10% green bonus

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        base_cost = usage_kwh * rate_per_kwh
        total_discount_pct = discount_percentage + self.GREEN_DISCOUNT
        discount = base_cost * (total_discount_pct / 100)
        return round(base_cost - discount, 4)


class PricingContext:
    """
    Context class that uses a pricing strategy.
    Decouples the algorithm from the caller.
    """

    def __init__(self, strategy: PricingStrategy):
        self._strategy = strategy

    def calculate(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        return self._strategy.calculate_cost(usage_kwh, rate_per_kwh, discount_percentage, usage_time)


def get_pricing_strategy(plan_type: str) -> PricingStrategy:
    """Factory function: returns the right strategy for a plan type."""
    strategies = {
        'flat': FlatRateStrategy(),
        'peak': PeakHourStrategy(),
        'green': GreenEnergyStrategy(),
    }
    return strategies.get(plan_type, FlatRateStrategy())
