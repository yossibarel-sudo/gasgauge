# GasGauge Project Status

Last Updated
21 July 2026

---

# Project Goal

GasGauge is a Progressive Web Application (PWA) for estimating the remaining LPG in a gas cylinder using:

- Cylinder weight
- Equipment specifications
- Historical measurements

Technology Stack

- React 19
- TypeScript
- Vite
- Material UI
- LocalStorage

---

# Current Sprint

Sprint 2 – Cylinder Tracking

Status:
🟢 In Progress

---

# Completed

## Project Foundation

✔ React + Vite configured

✔ TypeScript configured

✔ Material UI configured

✔ Project structure created

✔ GitHub repository connected

---

## Dashboard

✔ Remaining LPG %

✔ Remaining LPG (kg)

✔ Remaining cooking hours

✔ Remaining BBQ sessions

✔ Cylinder status

✔ Cylinder installation date

✔ DD/MM/YYYY date formatting

✔ Snackbar notifications

---

## Equipment

✔ Equipment model

✔ Burner model

✔ Default equipment

✔ Equipment setup page

✔ Gas consumption calculation

---

## Cylinder Installation

✔ Installation model

✔ Installation dialog

✔ LocalStorage persistence

✔ Dashboard updates immediately after installation

---

## Current Cylinder Weight

✔ Weight dialog

✔ Current cylinder weight stored

✔ Dashboard recalculates immediately

✔ LocalStorage updated

---

## Measurements

✔ Measurement model

✔ MeasurementService

Supports:

- Save
- Load
- Latest
- Delete
- Clear

---

# Current File Structure

src/

assets/

components/
- InstallationDialog.tsx
- WeightDialog.tsx

models/
- Equipment.ts
- Installation.ts
- Measurement.ts

pages/
- Dashboard.tsx
- EquipmentPage.tsx

services/
- defaultEquipment.ts
- defaultInstallation.ts
- GasCalculationService.ts
- InstallationService.ts
- MeasurementService.ts

theme/

App.tsx

main.tsx

---

# Next Milestone

Measurement History

Tasks:

- Save measurement from Dashboard
- Display latest measurement
- Measurements page
- Delete measurement
- Navigation between Dashboard and Measurements

---

# Future Milestones

## Statistics

- Weekly consumption

- Monthly consumption

- Average consumption

- Cylinder lifetime estimation

---

## BBQ Sessions

- Session recording

- Burner selection

- Consumption estimation

---

## Adaptive Calibration

Compare:

Configured consumption

vs

Measured consumption

Recommend equipment update when deviation exceeds ±10%.

---

# Coding Rules

- Keep complete files.
- Maintain production-quality code.
- No architecture redesign unless requested.
- Keep Roadmap.md, Requirements.md and DomainModel.md as the single source of truth.
- Finish every coding session with runnable code.
- Use Material UI components whenever practical.
- Prefer React state over repeated LocalStorage reads.
- Maintain backward compatibility where possible.

---

# Git Milestones

Sprint 1

Initial project

Sprint 1.5

Dashboard

Equipment

Installation

Sprint 2 (current)

Measurement infrastructure

Weight dialog

Current weight persistence

Measurement history (in progress)

---

# Weekend Goal

Deliver a fully usable application with:

✔ Dashboard

✔ Equipment

✔ Cylinder Installation

✔ Current Weight

✔ Measurement History

✔ Statistics (basic)

Ready for real-life LPG tracking.