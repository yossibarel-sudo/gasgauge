# GasGauge Roadmap

## Vision

GasGauge is a Progressive Web Application (PWA) that helps users estimate the remaining LPG in a gas cylinder using cylinder weight measurements and equipment specifications.

The application combines manufacturer specifications with real measurements to improve prediction accuracy over time.

---

# Version 1.0 (Minimum Lovable Product)

## Dashboard

- Remaining LPG (%)
- Remaining LPG (kg)
- Remaining cooking hours
- Remaining BBQ sessions
- Cylinder status
- Installation date
- Low gas warning

## Equipment

Configure one BBQ or gas appliance.

Store:

- Manufacturer
- Model
- Up to six burners
- Burner thermal output or gas consumption
- Default cooking session duration

## Cylinder Installation

Install a new cylinder by entering:

- Installation date
- Cylinder capacity
- Empty cylinder weight
- Initial gross weight

Each new cylinder creates a new installation.

## Measurements

- Enter current gross weight
- Automatically calculate remaining LPG
- Save measurement history

## BBQ Sessions

Record:

- Date
- Duration
- Burners used
- Optional notes

## Statistics

Display:

- Weekly consumption
- Monthly consumption
- Average consumption
- Estimated cylinder lifetime

## Adaptive Calibration

After at least three completed BBQ sessions with consecutive weight measurements:

- Calculate actual average gas consumption.
- Compare with configured equipment consumption.
- If the difference exceeds ±10%, recommend updating the equipment profile.
- Never update automatically without user confirmation.

---

# Current Sprint

Sprint 1

- Dashboard
- Calculation engine
- Equipment model
- Installation model
- Local storage
- Installation dialog

---

# Future

- SVG fuel gauge
- OCR meter/scale reading
- Export to Excel
- Cloud backup
- Multi-language support