# GasGauge Requirements

## Objective

Provide an accurate and simple method for estimating remaining LPG and predicting cylinder replacement.

---

# Functional Requirements

## Equipment

The application shall support one gas appliance.

Each equipment shall contain:

- Manufacturer
- Model
- Up to six burners

For each burner:

- Name (optional)
- Thermal output or gas consumption
- Units

Supported input units:

Thermal output

- W
- kW
- BTU/h

Gas consumption

- kg/h
- g/h

The application shall internally convert all values to kg/h.

---

## Cylinder Installation

Each cylinder replacement creates a new installation.

The user shall enter:

- Installation date
- Cylinder capacity
- Empty cylinder weight
- Initial gross weight

The application shall preserve the history of previous installations.

---

## Measurements

The user shall be able to:

- Record gross cylinder weight
- View previous measurements
- Delete incorrect measurements

The application shall automatically calculate:

- Remaining LPG
- Remaining percentage

---

## BBQ Sessions

For each session the user shall record:

- Date
- Duration
- Burners used (1-6)
- Optional notes

The application shall estimate gas consumption for the selected burner combination.

---

## Dashboard

The dashboard shall display:

- Remaining LPG (%)
- Remaining LPG (kg)
- Remaining cooking hours
- Remaining BBQ sessions
- Installation date
- Cylinder status
- Low gas warning

---

## Statistics

The application shall calculate:

- Average gas consumption
- Weekly consumption
- Monthly consumption
- Estimated cylinder lifetime

---

## Adaptive Calibration

The application shall compare:

Configured equipment consumption

versus

Measured average consumption.

After at least three completed BBQ sessions with associated weight measurements:

- Calculate measured average consumption.
- Compare with configured consumption.
- If deviation exceeds ±10%, recommend updating the configured value.
- User confirmation is required before applying the update.

---

# Non-functional Requirements

The application shall:

- Work offline
- Be installable as a PWA
- Support desktop and mobile devices
- Store data locally
- Use React and TypeScript