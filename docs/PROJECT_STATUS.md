# GasGauge - PROJECT STATUS

Last Updated: July 2026
Current Sprint: 2.3
Overall Progress: ~50%

---

# Project Vision

GasGauge is a Progressive Web Application (PWA) that helps BBQ users accurately estimate remaining LPG, monitor cylinder usage over time, predict remaining cooking hours and sessions, and optimize gas consumption.

Technology Stack

- React 19
- TypeScript
- Vite
- Material UI
- LocalStorage
- Git

---

# Current Architecture

Models
- Equipment
- Burner
- Installation
- Measurement

Services
- GasCalculationService
- InstallationService
- MeasurementService
- AnalysisService

Pages
- Dashboard
- EquipmentPage
- MeasurementsPage

Components
- InstallationDialog
- WeightDialog

---

# Completed Features

## Dashboard

✓ Remaining LPG %
✓ Remaining LPG (kg)
✓ Remaining BBQ Sessions
✓ Remaining Cooking Hours
✓ Cylinder Status
✓ Current Weight
✓ Install New Cylinder
✓ Add Cylinder Weight
✓ Last Recorded Weight
✓ DD/MM/YYYY formatting
✓ Navigation buttons

---

## Equipment

✓ Equipment model
✓ Burner model
✓ LPG conversion
✓ Equipment page
✓ Default equipment

---

## Cylinder Installation

✓ Installation dialog
✓ Install date
✓ Cylinder capacity
✓ Empty cylinder weight
✓ Initial gross weight
✓ Current gross weight
✓ LocalStorage persistence

---

## Measurements

✓ Add Weight dialog
✓ Measurement history
✓ Delete measurement
✓ Latest measurement retrieval
✓ LocalStorage persistence

---

## Analysis

Framework completed

AnalysisService currently calculates:

✓ Current LPG
✓ Gas Used
✓ Remaining %
✓ Cylinder Age
✓ Theoretical Consumption (kg/h)
✓ Remaining Hours (framework)
✓ Remaining Sessions (framework)

Planned

□ Actual Consumption (kg/h)
□ Average BBQ Session
□ Consumption Trend
□ Estimated Empty Date
□ Efficiency

---

## Navigation

✓ Dashboard
✓ Equipment
✓ Measurement History

---

# Local Storage

Implemented

gasgauge-installation

gasgauge-measurements

---

# Git

Commit after every completed feature.

---

# Coding Rules

- Strong typing
- No "any"
- import type where applicable
- Business logic inside Services
- UI logic inside Components
- Dashboard should remain presentation-oriented
- One completed feature per coding session

---

# Next Sprint (2.4)

Priority 1
- Integrate AnalysisService into Dashboard

Priority 2
- Record BBQ Hours with every weight measurement

Priority 3
- Calculate Actual Consumption (kg/h)

Priority 4
- Statistics Page

Priority 5
- Consumption charts

Priority 6
- Estimated Empty Date

Priority 7
- BBQ Session management

---

# Future Versions

Version 0.7
- Complete Analytics
- Statistics
- Consumption Trends

Version 0.8
- PWA improvements
- Export / Import data
- Settings page

Version 0.9
- Charts
- Multiple cylinders
- Multiple BBQ profiles

Version 1.0
- Production release