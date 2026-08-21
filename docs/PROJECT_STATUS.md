# GasGauge Project Status

**Last Updated:** 21-Aug-2026

---

# Current Sprint

Sprint 3.0 ✅ COMPLETED

---

# Completed

## Project Foundation
- React + TypeScript + Vite
- Material UI
- LocalStorage persistence
- Multi-page navigation
- Domain Model established

---

## Equipment
- Equipment setup page
- Up to 6 burners
- Supported units:
  - W
  - kW
  - BTU/h
  - g/h
  - kg/h
- Automatic conversion to kg/h

---

## Cylinder Installation
- New cylinder installation dialog
- Installation date
- Cylinder capacity
- Empty cylinder weight
- Initial gross weight
- Automatic current weight initialization
- New Installation ID for every cylinder
- Installation measurement automatically created

---

## Dashboard
- Remaining LPG
- Remaining %
- Cylinder status
- Cylinder age
- Current weight
- Cooking prediction
- Remaining cooking hours
- Remaining BBQ sessions
- Learning confidence
- Actual/Theoretical consumption
- Status indication
- Snackbar notifications

---

## BBQ Sessions
- Start session
- Stop session
- Running timer
- Multiple burner selection
- Individual burner tracking
- Estimated gas consumption
- Session history
- Automatic session reset after cylinder replacement

---

## Measurements
- Automatic BBQ measurements
- Manual measurements
- Installation measurements
- Measurement history
- Delete measurements
- Measurement chart
- Measurement type:
  - Installation
  - BBQ
  - Manual

---

## Learning Engine
- Learns only from BBQ related measurements
- Uses:
  - Weight difference
  - Session duration
  - Individual burners used
- Calculates:
  - Actual kg/h
  - Correction factor
  - Confidence
- Ignores invalid measurements
- Stores calibration history
- Learning History page

---

## Data Validation
- Reject impossible learning records
- Manual weight validation
- New cylinder becomes new weight reference
- Measurement type support
- BBQ-only learning

---

# Current Architecture

Dashboard

↓

Installation

↓

BBQ Sessions

↓

Cylinder Weight

↓

Measurement

↓

Learning Engine

↓

Prediction

---

# Known Minor Issues

- Cylinder age occasionally affected by timezone when installation date is today (planned fix using local date calculation)
- Improve date handling throughout project to avoid timezone edge cases

---

# Sprint 3.0 — Analytics & Prediction ✅ COMPLETED

## Analytics

- Average gas consumption (kg/h)
- Average gas consumption per BBQ session
- Last 7 days consumption
- Last 30 days consumption
- Consumption history chart
- Consumption trend:
  - Increasing
  - Decreasing
  - Stable
- Trend percentage compared with previous sessions
- Cylinder lifetime estimate

## Prediction

- Remaining LPG prediction
- Remaining cooking hours
- Remaining BBQ sessions
- Effective consumption rate
- Prediction confidence
- Distinction between:
  - Equipment specification
  - Learned consumption

## Adaptive Calibration

- Calibration recommendation after sufficient learning data
- Deviation calculation
- User confirmation required
- Equipment consumption updated after confirmation
- Calibration state persisted
- Repeated calibration cannot incrementally modify burner consumption

## Validation

- Manual measurements do not affect learning
- BBQ sessions are used for learning
- New cylinder starts a new learning sequence
- Historical learning data is preserved
- Invalid learning records are ignored

## Build Status

- TypeScript compilation: ✅
- Vite production build: ✅
- Application runs successfully: ✅

## Priority 3
- Data export/import
- Backup & restore
- Settings page

---

# Long-Term Roadmap

Sprint 4
- PWA improvements
- Offline enhancements
- Installable application

Sprint 5
- OCR from cylinder scale display
- Camera-assisted workflows
- Advanced analytics

---

# Design Decisions

✓ AnalysisService is the single calculation engine

✓ Learning is based only on BBQ sessions

✓ Learning is independent of cylinder replacement

✓ Every cylinder installation starts a new learning sequence

✓ Manual measurements never affect learning

✓ Individual burners are tracked

✓ Measurement history is permanent

✓ BBQ history resets for each cylinder

✓ LocalStorage remains the storage backend