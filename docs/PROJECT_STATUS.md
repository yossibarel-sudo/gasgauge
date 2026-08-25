# GasGauge – Project Status

Last Updated: August 24, 2026

## 1. Project Overview

GasGauge is a Progressive Web App (PWA) for estimating remaining LPG in a gas cylinder and predicting remaining cooking time / BBQ sessions.

The application uses cylinder weight, equipment consumption and BBQ session history to provide consumption analytics and adaptive predictions.

### Technology Stack

- React 19
- TypeScript
- Vite 8
- Material UI
- Recharts
- LocalStorage
- PWA / vite-plugin-pwa
- Git

---

## 2. Current Project Status

### Overall Status

**Application is functional and close to release-ready.**

The main application flow is working:

- Dashboard
- Equipment management
- Cylinder installation
- Weight measurements
- BBQ sessions
- Learning history
- Statistics
- Adaptive calibration recommendation
- PWA production build

The application has been successfully built and previewed as a production PWA.

---

## 3. Completed Functionality

### Dashboard

Implemented:

- Remaining LPG percentage
- Remaining LPG weight
- Current cylinder weight
- Cylinder age
- Measurement count
- Cylinder status:
  - GOOD
  - LOW
  - CRITICAL
- Remaining cooking hours
- Remaining BBQ sessions
- Configured consumption
- Measured consumption
- Efficiency
- Total BBQ hours
- Calibration Recommendation card
- Navigation to:
  - Equipment
  - History
  - BBQ Sessions
  - Learning History
  - Statistics
- Install New Cylinder
- Add Cylinder Weight

### Equipment

Implemented:

- Up to 6 burners
- Burner consumption entered as:
  - W
  - kW
  - BTU/h
  - kg/h
  - g/h
- Automatic conversion to kg/h
- Equipment consumption persistence
- Equipment calibration

### Cylinder Installation

Implemented:

- Installation date
- Cylinder capacity
- Empty cylinder weight
- Initial gross weight

The installation dialog now opens with:

- Current date
- Empty input fields for capacity, empty cylinder weight and gross weight

Any two of the three weight parameters can be entered and the third is calculated automatically.

Validation prevents saving inconsistent values.

A new installation receives a new installation ID.

### Measurements

Implemented:

- Weight history
- Measurement persistence
- Installation-specific measurements
- BBQ-related measurement handling

### BBQ Sessions

Implemented:

- BBQ session recording
- Session duration
- Burner selection
- Estimated gas consumption
- Installation-specific session history

### Statistics

Implemented:

- Average Consumption
- Average BBQ Session
- Last 7 Days consumption
- Last 30 Days consumption
- Consumption Trend chart
- Current Prediction
- Remaining LPG
- Consumption Rate
- Remaining Cooking Hours
- Remaining BBQ Sessions
- Prediction Confidence
- Cylinder Statistics
- Gas Consumed
- Estimated Cylinder Lifetime
- Consumption Trend

Redundant Average Hourly Consumption / Average Daily Consumption tiles were intentionally not added because Average Consumption already provides the required hourly consumption statistic.

### Learning

Implemented:

- Learning records
- Actual consumption calculation
- Theoretical consumption calculation
- Correction factor
- Ignored learning records
- Invalid measurement/session detection
- Learning statistics
- Calibration factor
- Prediction confidence
- Standard deviation
- Adaptive calibration recommendation

Learning records can be ignored for reasons such as:

- Weight increased
- No BBQ sessions
- Invalid gas consumption
- Invalid flow rate
- Correction factor out of range

### Calibration

Implemented:

- Calibration recommendation after sufficient learning data
- Calibration dialog
- User can:
  - Keep Current
  - Update
- Calibration update modifies equipment burner consumption
- Calibration factor and calibration date are stored
- Calibration dialog closes after Update
- Calibration is designed to avoid repeated incremental calibration when the same recommendation is already applied

The intended learning behavior is:

1. Establish equipment consumption baseline.
2. Collect valid BBQ sessions.
3. Evaluate actual consumption against the current baseline.
4. After 3 valid consecutive sessions showing significant deviation, recommend calibration.
5. When calibration is accepted, establish a new baseline.
6. Start a new learning cycle against the new baseline.
7. If burners are subsequently replaced and consumption changes, the system should detect the new deviation and recommend recalibration after 3 valid sessions.

---

## 4. Services

Current major services include:

- `AnalysisService`
- `BBQSessionService`
- `EquipmentService`
- `InstallationService`
- `MeasurementService`
- `LearningService`

`AnalysisService` is the single source of truth for application calculations.

---

## 5. Persistence

Application data is stored in LocalStorage.

Current storage areas include:

- Equipment
- Installation
- Measurements
- BBQ sessions
- Learning records
- Calibration information

A central `src/constants/storageKeys.ts` file exists.

---

## 6. PWA

PWA support is installed using:

- `vite-plugin-pwa@1.3.0`

Production build successfully generates:

- `manifest.webmanifest`
- `registerSW.js`
- `sw.js`
- Workbox file
- PWA icon

Production preview was tested and works as expected.

The Vite build currently reports a non-blocking warning that the main JavaScript chunk is larger than 500 kB.

This is not currently blocking release.

---

## 7. Current Known Issue

The latest learning/calibration changes introduced a TypeScript requirement for:

```ts
calibrationFactorAtTime in LearningRecord.

The current Learning.ts model already contains this required property.

LearningService.ts currently needs all six LearningRecord creation points to populate: calibrationFactorAtTime

using the current applied calibration factor.

AnalysisService.ts also has an unused EquipmentService import that should be removed.

These are the immediate outstanding TypeScript issues.

---

## 8. Latest Learning/Calibration Change

The learning mechanism is being changed so calibration creates a new learning baseline.

EquipmentService now stores:

Applied calibration factor
Calibration date

LearningService.statistics() was updated to consider learning records after the most recent calibration as the active learning cycle.

The purpose is to prevent old learning data from repeatedly affecting the newly calibrated equipment.

The calibration mechanism must support:

Initial calibration
Three-session validation after calibration
Detection of changed burner consumption
New calibration recommendation after three valid sessions
No endless multiplication of burner consumption

---

## 9. Current Immediate Task

Complete and verify the learning/calibration cycle.

Immediate steps
Fix calibrationFactorAtTime TypeScript errors in LearningService.ts.
Remove the unused EquipmentService import from AnalysisService.ts.
Run:
npm run build

Verify there are no TypeScript errors.
Test the calibration workflow in the application.
Verify that after calibration:
old learning records do not affect the new baseline
the next valid sessions are evaluated against the new baseline
three consecutive valid sessions can trigger a new recommendation
accepting calibration does not endlessly multiply consumption

---

### 10. Next Recommended Steps

After the learning mechanism is verified:

Sprint 5 – Finalization / Release Preparation

Focus on practical improvements rather than adding unnecessary features.

Recommended priorities:

Complete and verify adaptive learning/calibration.
Verify all main user workflows end-to-end.
Verify LocalStorage persistence and installation transitions.
Test PWA installation and offline behavior.
Improve user-facing validation/error messages where needed.
Perform final UI consistency and usability cleanup.
Review production build warning only if performance becomes an issue.
Prepare a release-ready version.
Explicitly Not Planned

Cylinder reading using the phone camera is not planned.

The physical cylinder markings do not provide sufficient contrast/reliability for practical OCR, so manual weight entry remains the intended method.

---

## 11. Development Principles

Keep implementation practical and focused.
Prefer coding over prolonged planning.
Avoid unnecessary redesigns.
Do not repeat already completed work.
Preserve working functionality.
Make small, testable changes.
Run npm run build after significant changes.
Keep AnalysisService as the single source of truth for calculations.