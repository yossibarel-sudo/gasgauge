# GasGauge Domain Model

## Overview

GasGauge manages the complete lifecycle of LPG usage for a single gas appliance.

The application distinguishes between:

- Equipment
- Installations
- Measurements
- BBQ Sessions

---

# Equipment

Represents the gas appliance.

Properties

- Manufacturer
- Model
- Burners (up to six)

Relationships

One Equipment

contains many Installations.

---

# Burner

Represents one gas burner.

Properties

- Name
- Thermal Output
- Output Units
- Calculated Gas Consumption

Supported Units

Power

- W
- kW
- BTU/h

Gas Consumption

- kg/h
- g/h

---

# Installation

Represents one installed LPG cylinder.

Properties

- Installation Date
- Cylinder Capacity
- Empty Cylinder Weight
- Initial Gross Weight
- Status

Relationships

One Installation contains:

- Many Measurements
- Many BBQ Sessions

Installing a new cylinder creates a new Installation.

---

# Measurement

Represents one cylinder weight measurement.

Properties

- Date
- Gross Weight
- Calculated Remaining LPG
- Notes

---

# BBQ Session

Represents one cooking session.

Properties

- Date
- Duration
- Burners Used
- Notes

---

# Calculation Engine

Inputs

- Cylinder Capacity
- Empty Cylinder Weight
- Current Gross Weight
- Equipment Consumption

Outputs

- Remaining LPG
- Remaining LPG (%)
- Remaining Cooking Hours
- Remaining BBQ Sessions
- Status

---

# Adaptive Calibration

After at least three completed BBQ sessions with associated weight measurements:

- Calculate actual average gas consumption.
- Compare with configured equipment consumption.
- Recommend updating the equipment profile if the deviation exceeds ±10%.
- Never update automatically.

---

# Status Levels

GOOD

More than 40%

LOW

20% to 40%

CRITICAL

Below 20%