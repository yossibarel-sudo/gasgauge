# GasGauge - Project Status

**Last Updated:** 25 July 2026
**Project:** GasGauge
**Platform:** React + TypeScript + Vite + Material UI
**Current Sprint:** Sprint 2.7
**Overall Progress:** ~75%

---

# Project Goal

GasGauge predicts the remaining LPG in a cylinder from weight measurements,
equipment configuration and real cooking history.

Unlike simple gas calculators, GasGauge continuously improves its prediction
accuracy by learning from actual user behaviour.

---

# Completed

## Core Architecture

✔ React + TypeScript + Vite

✔ Material UI

✔ LocalStorage persistence

✔ Modular services

✔ Strong TypeScript models

---

## Dashboard

✔ Remaining LPG

✔ Remaining %

✔ Cylinder status

✔ Remaining cooking hours

✔ Remaining BBQ sessions

✔ Current weight

✔ Cylinder age

✔ Measurements count

✔ Traffic-light status

✔ Adaptive consumption display

---

## Equipment

✔ Manufacturer

✔ Model

✔ Dynamic burner list

✔ Supports 1–6 burners

✔ Add burner

✔ Remove burner

✔ Automatic kg/h calculation

✔ Default session duration

---

## Cylinder Installation

✔ Install new cylinder

✔ Installation date

✔ Initial weight

✔ Empty cylinder weight

✔ Cylinder capacity

---

## Measurements

✔ Weight history

✔ Current weight update

✔ Measurement history

---

## BBQ Sessions

✔ BBQ session history

✔ Manual session entry

✔ Live Start Cooking

✔ Live Finish Cooking

✔ Running timer

✔ Burners used selection

✔ Estimated LPG consumption

✔ Active session recovery after browser refresh

---

## Analysis Engine

✔ Remaining LPG calculation

✔ Remaining percentage

✔ Gas consumed

✔ Theoretical burner consumption

✔ BBQ history analysis

✔ Effective consumption calculation

✔ Actual consumption

✔ Remaining cooking prediction

✔ Remaining BBQ prediction

✔ Efficiency calculation

---

## Navigation

✔ Dashboard

✔ Equipment

✔ Measurements

✔ BBQ Sessions

✔ Consistent Back to Dashboard button

---

# Current Data Model

Installation

Equipment

Burner

Measurement

BBQSession

---

# Current Services

AnalysisService

EquipmentService

InstallationService

MeasurementService

BBQSessionService

BurnerCalculationService

---

# Next Sprint (2.8)

## Adaptive Learning Engine

Instead of assuming burners always consume their theoretical gas rate,
GasGauge will continuously learn from completed cylinders.

Planned features:

- Learn correction factor from completed cylinders
- Automatically calibrate burner model
- Improve future gas predictions
- Confidence score for predictions
- Ignore abnormal cooking sessions
- Display "Prediction Confidence" on Dashboard

---

# Future Roadmap

Sprint 2.9

- Cooking Profiles
    - Fast cooking
    - Normal cooking
    - Low flame
    - BBQ profile

Sprint 3.0

- Charts
- Trend graphs
- Cylinder comparison
- Usage analytics

Sprint 3.1

- PWA improvements
- Export / Import
- Cloud backup

Sprint 3.2

- OCR weight reading from scale display
- OCR gas meter reading
- AI cooking insights

---

# Known Issues

None

Project builds successfully.

TypeScript clean.

Application stable.

---

# Current Git Tag

Sprint 2.7 Stable

---

# Overall Assessment

Project structure is now stable.

The core prediction engine is operational.

Future work is focused primarily on improving prediction accuracy rather than architectural changes.