import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { defaultEquipment } from "../services/defaultEquipment";
import type { Burner } from "../models/Equipment";

export default function EquipmentPage() {
  const equipment = defaultEquipment;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Equipment Setup
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">
            {equipment.manufacturer}
          </Typography>

          <Typography color="text.secondary">
            {equipment.model}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle2">
                Default BBQ Session
              </Typography>

              <Typography>
                {equipment.defaultSessionDurationMinutes} minutes
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">
                Number of Burners
              </Typography>

              <Typography>
                {equipment.burners.length}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Burners
          </Typography>

          <List>
            {equipment.burners.map((burner: Burner) => (
              <ListItem key={burner.id} divider>
                <ListItemText
                  primary={burner.name}
                  secondary={`${burner.value} ${burner.unit} (${burner.calculatedKgPerHour.toFixed(
                    3
                  )} kg/h)`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}