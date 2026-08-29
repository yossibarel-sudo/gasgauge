import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import type { Installation } from "../models/Installation";

interface InstallationDialogProps {
  open: boolean;
  installation: Installation;
  onCancel: () => void;
  onSave: (installation: Installation) => void;
}

export default function InstallationDialog({
  open,
  installation,
  onCancel,
  onSave,
}: InstallationDialogProps) {
  const [editedInstallation, setEditedInstallation] =
  useState<Installation>({
    ...installation,
    installDate: new Date(),
    cylinderCapacityKg: 0,
    emptyCylinderWeightKg: 0,
    initialGrossWeightKg: 0,
    currentGrossWeightKg: 0,
  });

  const [capacity, setCapacity] = useState("");
  const [emptyWeight, setEmptyWeight] = useState("");
  const [initialGross, setInitialGross] = useState("");

  const updateWeights = (
    changedField: "capacity" | "empty" | "gross",
    value: string
  ) => {
    let newCapacity = capacity;
    let newEmpty = emptyWeight;
    let newGross = initialGross;

    if (changedField === "capacity") {
      newCapacity = value;
      setCapacity(value);
    }

    if (changedField === "empty") {
      newEmpty = value;
      setEmptyWeight(value);
    }

    if (changedField === "gross") {
      newGross = value;
      setInitialGross(value);
    }

    const c = Number(newCapacity);
    const e = Number(newEmpty);
    const g = Number(newGross);

    const hasC = newCapacity !== "" && c > 0;
    const hasE = newEmpty !== "" && e >= 0;
    const hasG = newGross !== "" && g > 0;

    // Capacity + Empty -> calculate Gross
    if (
      changedField !== "gross" &&
      hasC &&
      hasE
    ) {
      const calculatedGross = c + e;

      setInitialGross(calculatedGross.toFixed(3));
      newGross = String(calculatedGross);
    }

    // Capacity + Gross -> calculate Empty
    else if (
      changedField !== "empty" &&
      hasC &&
      hasG
    ) {
      const calculatedEmpty = g - c;

      if (calculatedEmpty >= 0) {
        setEmptyWeight(calculatedEmpty.toFixed(3));
        newEmpty = String(calculatedEmpty);
      }
    }

    // Empty + Gross -> calculate Capacity
    else if (
      changedField !== "capacity" &&
      hasE &&
      hasG
    ) {
      const calculatedCapacity = g - e;

      if (calculatedCapacity > 0) {
        setCapacity(calculatedCapacity.toFixed(3));
        newCapacity = String(calculatedCapacity);
      }
    }

    setEditedInstallation((current) => ({
      ...current,
      cylinderCapacityKg: Number(newCapacity) || 0,
      emptyCylinderWeightKg: Number(newEmpty) || 0,
      initialGrossWeightKg: Number(newGross) || 0,
      currentGrossWeightKg: Number(newGross) || 0,
    }));
  };

  const handleSave = () => {
    const c = Number(capacity);
    const e = Number(emptyWeight);
    const g = Number(initialGross);

    const valid =
      c > 0 &&
      e >= 0 &&
      g > 0 &&
      g >= e &&
      Math.abs(g - (c + e)) < 0.01;

    if (!valid) {
      return;
    }

    onSave({
      ...editedInstallation,
      id: crypto.randomUUID(),
      installDate: new Date(),
      cylinderCapacityKg: c,
      emptyCylinderWeightKg: e,
      initialGrossWeightKg: g,
      currentGrossWeightKg: g,
    });
  };

  const valuesValid =
    Number(capacity) > 0 &&
    Number(emptyWeight) >= 0 &&
    Number(initialGross) > 0 &&
    Number(initialGross) >= Number(emptyWeight) &&
    Math.abs(
      Number(initialGross) -
        (Number(capacity) + Number(emptyWeight))
    ) < 0.01;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Install New Cylinder
      </DialogTitle>

      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Installation Date"
          type="date"
          value={
            editedInstallation.installDate
              .toISOString()
              .split("T")[0]
          }
          onChange={(e) => {
            const [year, month, day] =
              e.target.value
                .split("-")
                .map(Number);

            setEditedInstallation({
              ...editedInstallation,
              installDate: new Date(
                year,
                month - 1,
                day
              ),
            });
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Cylinder Capacity (kg)"
          type="number"
          value={capacity}
          onChange={(e) =>
            updateWeights(
              "capacity",
              e.target.value
            )
          }
        />

        <TextField
          margin="normal"
          fullWidth
          label="Empty Cylinder Weight (kg)"
          type="number"
          value={emptyWeight}
          onChange={(e) =>
            updateWeights(
              "empty",
              e.target.value
            )
          }
        />

        <TextField
          margin="normal"
          fullWidth
          label="Initial Gross Weight (kg)"
          type="number"
          value={initialGross}
          onChange={(e) =>
            updateWeights(
              "gross",
              e.target.value
            )
          }
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!valuesValid}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}