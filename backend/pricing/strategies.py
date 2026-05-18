class PricingStrategy:
    """Base strategy for pricing calculations."""

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        raise NotImplementedError("Subclasses must implement calculate_cost")


class FlatRateStrategy(PricingStrategy):
    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        base_cost = usage_kwh * rate_per_kwh
        discount = base_cost * (discount_percentage / 100)
        return round(base_cost - discount, 4)


class PeakHourStrategy(PricingStrategy):
    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        multiplier = 1.0

        if usage_time:
            if isinstance(usage_time, str):
                try:
                    hour = int(usage_time.split(":")[0])
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


class GreenEnergyStrategy(PricingStrategy):
    GREEN_DISCOUNT = 10

    def calculate_cost(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        base_cost = usage_kwh * rate_per_kwh
        total_discount_pct = discount_percentage + self.GREEN_DISCOUNT
        discount = base_cost * (total_discount_pct / 100)
        return round(base_cost - discount, 4)


class PricingContext:
    def __init__(self, strategy):
        self._strategy = strategy

    def calculate(self, usage_kwh, rate_per_kwh, discount_percentage=0, usage_time=None):
        return self._strategy.calculate_cost(
            usage_kwh,
            rate_per_kwh,
            discount_percentage,
            usage_time,
        )


def get_pricing_strategy(plan_type):
    strategies = {
        "flat": FlatRateStrategy(),
        "peak": PeakHourStrategy(),
        "green": GreenEnergyStrategy(),
    }
    return strategies.get(plan_type, FlatRateStrategy())
