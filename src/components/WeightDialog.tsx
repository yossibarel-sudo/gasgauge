import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface WeightDialogProps {
  open: boolean;
  currentWeight: number;
  onCancel: () => void;
  onSave: (weight: number) => void;
}

export default function WeightDialog({
  open,
  currentWeight,
  onCancel,
  onSave,
}: WeightDialogProps) {
  const [weight, setWeight] = useState(currentWeight);

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
      <DialogTitle>Add Cylinder Weight</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="normal"
          label="Current Weight (kg)"
          type="number"
          slotProps={{
            htmlInput: {
              step: 0.01,
            },
          }}
          value={weight}
          onChange={(e) =>
            setWeight(Number(e.target.value))
          }
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => onSave(weight)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}