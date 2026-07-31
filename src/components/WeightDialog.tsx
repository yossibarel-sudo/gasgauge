import { useEffect, useState } from "react";
import {
  Alert,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface WeightDialogProps {

  open: boolean;

  previousWeight: number;

  currentWeight: number;

  sessionDate?: Date;

  sessionDurationHours?: number;

  burners?: string;

  estimatedGasKg?: number;

  onCancel: () => void;

  onSave: (weight: number) => void;

}

export default function WeightDialog({
  open,
  previousWeight,
  currentWeight,
  sessionDate,
  sessionDurationHours,
  burners,
  estimatedGasKg,
  onCancel,
  onSave,
}: WeightDialogProps) 
{

  const [weight, setWeight] =
    useState(currentWeight);

    const gasConsumed =
  previousWeight - weight;

const invalidWeight =
  weight >= previousWeight;

  useEffect(() => {

    setWeight(currentWeight);

  }, [currentWeight]);

  return (

    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
    >

      <DialogTitle>
        Add Cylinder Weight
      </DialogTitle>

      <DialogContent>

        <Typography
  variant="subtitle1"
  sx={{ fontWeight: "bold" }}
>
  Last BBQ Session
  {sessionDate &&
    ` (${sessionDate.toLocaleDateString()} ${sessionDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })})`}
</Typography>

<Divider sx={{ my: 1 }} />

<Typography>
  Duration:
  {" "}
  {(sessionDurationHours ?? 0).toFixed(2)}
  {" h"}
</Typography>

<Typography>
  Burners:
  {" "}
  {burners ?? "-"}
</Typography>

<Typography>
  Estimated LPG:
  {" "}
  {(estimatedGasKg ?? 0).toFixed(2)}
  {" kg"}
</Typography>

<Divider sx={{ my: 2 }} />

<Typography>
  Previous Weight:
  {" "}
  {previousWeight.toFixed(2)}
  {" kg"}
</Typography>

<TextField
  autoFocus
  fullWidth
  margin="normal"
  label="Current Weight (kg)"
  type="number"
  value={weight}
  slotProps={{
    htmlInput: {
      step: 0.01,
    },
  }}
  onChange={(e) =>
    setWeight(
      Number(e.target.value)
    )
  }
/>

<Typography
  sx={{ mt: 1 }}
>
  Gas Consumed:
  {" "}
  {Math.max(0, gasConsumed).toFixed(2)}
  {" kg"}
</Typography>

{invalidWeight && (

  <Alert
    severity="error"
    sx={{ mt: 2 }}
  >
    Current weight must be lower than the previous weight.
  </Alert>

)}
      </DialogContent>

      <DialogActions>

        <Button onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {

  if (invalidWeight) {
    return;
  }

  onSave(weight);

}}
        >
          Save
        </Button>

      </DialogActions>

    </Dialog>

  );

}