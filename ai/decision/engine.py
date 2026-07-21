from rules import RULES


def decide(waste_type: str, count: int):

    waste_type = waste_type.lower()

    rule = RULES.get(waste_type)

    if not rule:
        return "DISPOSE"

    if "default" in rule:
        return rule["default"]

    if count < rule["threshold"]:
        return rule["small_quantity"]

    return rule["large_quantity"]