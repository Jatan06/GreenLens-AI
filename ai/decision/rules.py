RULES = {

    # ── RECYCLABLE ──────────────────────────────────────────
    "plastic bottle": {
        "small_quantity": "REUSE",
        "large_quantity": "RECYCLE",
        "threshold": 5
    },
    "plastic bag": {
        "small_quantity": "REUSE",
        "large_quantity": "RECYCLE",
        "threshold": 5
    },
    "plastic bottle cap": {
        "default": "RECYCLE"
    },
    "glass bottle": {
        "small_quantity": "REUSE",
        "large_quantity": "RECYCLE",
        "threshold": 3
    },
    "can": {
        "default": "RECYCLE"
    },
    "steel can": {
        "default": "RECYCLE"
    },
    "paper": {
        "default": "RECYCLE"
    },
    "newspaper": {
        "default": "RECYCLE"
    },
    "cardboard": {
        "default": "RECYCLE"
    },
    "drink carton": {
        "default": "RECYCLE"
    },
    "pop tab": {
        "default": "RECYCLE"
    },
    "wooden pallet": {
        "small_quantity": "REUSE",
        "large_quantity": "RECYCLE",
        "threshold": 2
    },
    "styrofoam": {
        "default": "RECYCLE"   # Specialized drop-off only
    },
    "tire": {
        "default": "RECYCLE"
    },

    # ── COMPOSTABLE ──────────────────────────────────────────
    "banana peel": {
        "default": "COMPOST"
    },
    "food waste": {
        "default": "COMPOST"
    },
    "coffee grounds": {
        "default": "COMPOST"
    },
    "fruit peels": {
        "default": "COMPOST"
    },
    "tea bag": {
        "default": "COMPOST"
    },
    "leaves": {
        "default": "COMPOST"
    },

    # ── HAZARDOUS ────────────────────────────────────────────
    "battery": {
        "default": "STORE"         # Store until hazardous drop-off
    },
    "cfl bulb": {
        "default": "STORE"
    },
    "paint can": {
        "default": "STORE"
    },
    "medicine": {
        "default": "STORE"
    },
    "syringe": {
        "default": "STORE"
    },
    "chemical bottle": {
        "default": "STORE"
    },
    "thermometer": {
        "default": "STORE"
    },

    # ── E-WASTE ──────────────────────────────────────────────
    "mobile phone": {
        "default": "SELL"          # If working, sell/donate; else drop-off
    },
    "laptop": {
        "default": "SELL"
    },
    "keyboard": {
        "default": "E-WASTE DROP-OFF"
    },
    "charger": {
        "default": "E-WASTE DROP-OFF"
    },
    "headphones": {
        "small_quantity": "SELL",
        "large_quantity": "E-WASTE DROP-OFF",
        "threshold": 2
    },
    "printer": {
        "default": "E-WASTE DROP-OFF"
    },
    "monitor": {
        "default": "E-WASTE DROP-OFF"
    },
}