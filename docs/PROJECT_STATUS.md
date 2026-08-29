# GasGauge – Project Status

Last Updated: August 27, 2026

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

**Application is functional, installable, and release-candidate ready.**

The main application flow is working:

- Dashboard
- Equipment management
- Cylinder installation
- Weight measurements
- BBQ sessions
- Learning history
- Statistics
- Adaptive calibration
- PWA production build
- PWA installation
- Offline operation

The production PWA has been successfully:

- Built
- Previewed
- Deployed to Netlify
- Opened in a browser
- Installed as a PWA
- Launched as a standalone application
- Tested for offline operation

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
- Calibrated consumption used for prediction
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
- Calibration factor persistence
- Calibration date persistence

### Cylinder Installation

Implemented:

- Installation date
- Cylinder capacity
- Empty cylinder weight
- Initial gross weight

The installation dialog:

- Defaults date to current date
- Starts capacity, empty-cylinder weight and gross weight empty
- Accepts any two of the three weight parameters
- Automatically calculates the third
- Prevents saving inconsistent combinations
- Creates a new installation ID

A new cylinder installation creates a new installation record.

GasGauge tracks cylinder installations rather than cylinder refills.

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
- Burner-dependent estimated gas consumption
- Installation-specific session history
- Active session persistence
- Burner selection persistence during an active session

The active BBQ session is timestamp-based.

The session can continue through:

- Component/page changes
- Browser refresh
- Screen locking
- Switching applications

The selected burners are persisted as part of the active session.

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

Implemented and verified:

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
- Calibration-cycle separation after calibration
- Consecutive valid-session handling

Learning records can be ignored for reasons such as:

- Weight increased
- No BBQ sessions
- Invalid gas consumption
- Invalid flow rate
- Correction factor out of range

The learning mechanism evaluates the correction Factor relative to the expected consumption for the burners selected during each session.

This allows different burner combinations to be compared without treating their different absolute kg/h values as a fault.

For example, a one-burner session and an all-burner session can have very different actual kg/h values while still producing comparable correction Factors.

An ignored record breaks the current consecutive learning cycle.

The learning mechanism no longer uses an arbitrary 2 kg/h upper limit to reject a learning record. Legitimate higher-consumption sessions, including multi-burner sessions, can therefore participate in learning when their correction Factor is valid.

### Calibration

Implemented and functionally verified:

- Calibration recommendation after 3 valid consecutive learning sessions with significant deviation
- Calibration dialog
- User can:
  - Keep Current
  - Update
- Calibration update modifies the equipment burner baseline
- Calibration factor is stored
- Calibration date is stored
- Calibration dialog closes after Update
- Previous learning records remain visible in Learning History
- Previous-cycle learning records do not affect the new cycle
- Calibration is applied only once
- Repeated refreshes do not repeatedly multiply burner consumption
- New learning sessions are evaluated against the newly calibrated baseline

The intended learning behavior is:

1. Establish equipment consumption baseline.
2. Collect valid BBQ sessions.
3. Evaluate actual consumption against the current baseline for the selected burners.
4. Require 3 valid consecutive sessions showing significant deviation.
5. Recommend calibration when deviation exceeds 10%.
6. When calibration is accepted, establish a new baseline.
7. Start a new learning cycle against the new baseline.
8. If burner consumption subsequently changes, the system can detect the new deviation and recommend recalibration after 3 valid consecutive sessions.

### Calibration Verification

The complete calibration cycle has been tested successfully.

Verified behavior included:

- Mixed burner combinations
- Different absolute consumption rates
- Factor-based comparison
- Three valid consecutive learning sessions
- Calibration factor above the 10% threshold
- Calibration recommendation
- Calibration Update
- Equipment baseline updated once
- Browser refresh after calibration
- Stable calibrated baseline
- No repeated multiplication
- Previous learning records retained
- New learning cycle established after calibration

A representative verified calibration test produced approximately:

- Calibration factor: 1.151
- Deviation: 15.1%
- Three valid learning records
- Calibration recommendation displayed

After accepting Update, the calibrated consumption remained stable after refresh and did not undergo further multiplication.

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

A central:

```text file exists.
src/constants/storageKeys.ts

Active BBQ session information, including selected burners, is persisted so the session can continue across:

Page changes
Browser refresh
Screen locking
Application switching

---

## 6. PWA

PWA support is installed using:

vite-plugin-pwa@1.3.0

Production build successfully generates:

manifest.webmanifest
registerSW.js
sw.js
Workbox precache file
PWA icons

PWA configuration includes:

Standalone display mode
/ scope
/ start URL
Explicit PWA application ID
192×192 PNG icon
512×512 PNG icon
Automatic service-worker registration/update
PWA Verification

Verified:

Production build
Production preview
Netlify deployment
Browser loading
Browser installation
Standalone application launch
Application navigation after installation
LocalStorage persistence
Offline application loading

The application is therefore considered installable and operational as a PWA.

The Vite build currently reports a non-blocking warning that the main JavaScript chunk is larger than 500 kB.

This is not currently blocking release.

Bundle-size optimization can be considered later if actual performance testing indicates a need.

---

## 7. TypeScript / Build Status

The previous calibrationFactorAtTime TypeScript issues have been resolved.

All LearningRecord creation points now populate:

calibrationFactorAtTime

using the calibration factor applicable when the learning record was created.

The unused EquipmentService import in:

src/services/AnalysisService.ts

has been removed.

The current production build:

npm run build

passes successfully with no TypeScript errors.

---

## 8. Latest Learning/Calibration Changes

The learning mechanism now treats calibration as the creation of a new learning baseline.

EquipmentService stores:

Applied calibration factor
Calibration date

LearningService.statistics() considers only records belonging to the current calibration cycle.

Ignored records break the current consecutive valid-session sequence.

AnalysisService uses the learning statistics as the source for:

Effective consumption
Calibration deviation
Calibration recommendation
Recommended consumption

This prevents old learning data from affecting the newly calibrated equipment.

The calibration mechanism has been functionally verified with:

Mixed burner selections
Different consumption rates
Three-session calibration cycle
Calibration update
Refresh/reload after calibration

---

## 9. Current Immediate Task

The core adaptive Learning/Calibration task is:

COMPLETE AND VERIFIED

No calibration-related code changes are currently required.

The project should now move from feature development into final release validation and cleanup.

---

## 10. Next Recommended Steps

Sprint 5 – Finalization / Release Preparation

Focus on practical improvements rather than adding unnecessary features.

Recommended priorities:

Verify all main user workflows end-to-end.
Verify LocalStorage persistence and installation transitions.
Perform final PWA installation and offline regression testing.
Review user-facing validation and error messages where needed.
Perform final UI consistency and usability cleanup.
Review the production bundle-size warning only if performance becomes an issue.
Verify that the current Netlify production deployment matches the tested release candidate.
Create a final release commit.
Optionally create a Git release tag.
Release Regression Scenarios

Before final release, verify:

New cylinder installation
Initial weight entry
Additional weight measurement
BBQ session with one burner
BBQ session with multiple burners
Mixed burner combinations
Learning History
Three-session calibration recommendation
Calibration Update
New learning cycle after calibration
Application refresh
Application relaunch
Installed PWA launch
Offline launch
LocalStorage data persistence

---

## 11. Explicitly Not Planned

Cylinder Camera/OCR

Cylinder reading using the phone camera is not planned.

The physical cylinder markings do not provide sufficient contrast/reliability for practical OCR, so manual weight entry remains the intended method.

Multiple BBQs

No support for managing multiple BBQ units in parallel is planned.

Cylinder Serial Number / Refill Tracking

GasGauge tracks cylinder installations, not refills.

The following are intentionally not planned:

Cylinder serial number
Last refill date

A new cylinder installation creates a new installation record.

---

## 12. Development Principles

Keep implementation practical and focused.

Prefer coding over prolonged planning.

Avoid unnecessary redesigns.

Do not repeat already completed work.

Preserve working functionality.

Make small, testable changes.

Run:

npm run build

after significant changes.

Keep AnalysisService as the single source of truth for calculations.

For small corrections:

Modify only the relevant file/section.
Provide exact file paths.
Provide copy-paste-ready repair snippets.
Do not regenerate the entire project package unless the change is large enough to justify it.

Development should remain focused on getting GasGauge to a stable release rather than adding unnecessary features.