import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { defaultEquipment } from "../services/defaultEquipment";

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

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">
                Default BBQ Session
              </Typography>

              <Typography>
                {equipment.defaultSessionDurationMinutes} minutes
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">
                Number of Burners
              </Typography>

              <Typography>
                {equipment.burners.length}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Burners
          </Typography>

          <List>
            {equipment.burners.map((burner) => (
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