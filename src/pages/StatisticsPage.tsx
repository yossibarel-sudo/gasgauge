import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { AnalysisService } from "../services/AnalysisService";
import { InstallationService } from "../services/InstallationService";
import { EquipmentService } from "../services/EquipmentService";
import { MeasurementService } from "../services/MeasurementService";
import { BBQSessionService } from "../services/BBQSessionService";

interface StatisticsPageProps {
  onBack: () => void;
}

interface ConsumptionPoint {
  date: string;
  gasKg: number;
  hours: number;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

export default function StatisticsPage({
  onBack,
}: StatisticsPageProps) {
  const installation = InstallationService.load();
  const equipment = EquipmentService.load();
  const measurements = MeasurementService.load();

  const analysis = AnalysisService.analyze(
    installation,
    equipment,
    measurements
  );

  const sessions = BBQSessionService
    .loadForInstallation(installation.id)
    .filter(
      (session) =>
        session.durationHours > 0 &&
        session.estimatedGasUsedKg > 0
    )
    .sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime()
    );

  const chartData: ConsumptionPoint[] =
    sessions.map((session) => ({
      date: formatDate(session.date),
      gasKg: Number(
        session.estimatedGasUsedKg.toFixed(3)
      ),
      hours: Number(
        session.durationHours.toFixed(2)
      ),
    }));

  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    now.getDate() - 7
  );

  const startOfMonth = new Date(now);
  startOfMonth.setDate(
    now.getDate() - 30
  );

  const weeklySessions = sessions.filter(
    (session) =>
      session.date >= startOfWeek
  );

  const monthlySessions = sessions.filter(
    (session) =>
      session.date >= startOfMonth
  );

  const weeklyConsumption =
    weeklySessions.reduce(
      (sum, session) =>
        sum + session.estimatedGasUsedKg,
      0
    );

  const monthlyConsumption =
    monthlySessions.reduce(
      (sum, session) =>
        sum + session.estimatedGasUsedKg,
      0
    );

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        Statistics
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Average Consumption
              </Typography>

              <Typography variant="h5">
                {analysis.averageGasPerHourKg.toFixed(
                  3
                )} kg/h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Average BBQ Session
              </Typography>

              <Typography variant="h5">
                {analysis.averageGasPerSessionKg.toFixed(
                  3
                )} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Last 7 Days
              </Typography>

              <Typography variant="h5">
                {weeklyConsumption.toFixed(2)} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography
                color="text.secondary"
              >
                Last 30 Days
              </Typography>

              <Typography variant="h5">
                {monthlyConsumption.toFixed(2)} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
          >
            Consumption Trend
          </Typography>

          {chartData.length === 0 ? (
            <Typography color="text.secondary">
              No completed BBQ sessions available
              for the chart.
            </Typography>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 300,
              }}
            >
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="gasKg"
                    name="Gas (kg)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
  <CardContent>
    <Typography
      variant="h6"
      gutterBottom
    >
      Current Prediction
    </Typography>

    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            Remaining LPG
          </TableCell>
          <TableCell align="right">
            {analysis.remainingLpgKg.toFixed(2)} kg
          </TableCell>
        </TableRow>

        <TableRow>
  <TableCell>
    Consumption Rate
  </TableCell>

  <TableCell align="right">
    {analysis.effectiveKgPerHour !== null
      ? `${analysis.effectiveKgPerHour.toFixed(3)} kg/h`
      : "--"}

    <Typography
      variant="body2"
      color="text.secondary"
    >
      {analysis.usingActualConsumption
        ? "Based on learned consumption"
        : "Based on equipment specification"}
    </Typography>
  </TableCell>
</TableRow>

        <TableRow>
          <TableCell>
            Remaining Cooking Hours
          </TableCell>
          <TableCell align="right">
            {analysis.remainingHours !== null
              ? `${analysis.remainingHours.toFixed(1)} h`
              : "--"}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            Remaining BBQ Sessions
          </TableCell>
          <TableCell align="right">
            {analysis.remainingSessions !== null
              ? analysis.remainingSessions.toFixed(1)
              : "--"}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            Prediction Confidence
          </TableCell>
          <TableCell align="right">
            {analysis.predictionConfidence}%
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
          >
            Cylinder Statistics
          </Typography>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  Cylinder Capacity
                </TableCell>

                <TableCell align="right">
                  {installation.cylinderCapacityKg.toFixed(
                    1
                  )} kg
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  Gas Consumed
                </TableCell>

                <TableCell align="right">
                  {analysis.gasUsedKg.toFixed(2)} kg
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  Estimated Cylinder Lifetime
                </TableCell>

                <TableCell align="right">
                  {analysis.estimatedCylinderLifetimeDays >
                  0
                    ? `${analysis.estimatedCylinderLifetimeDays.toFixed(
                        0
                      )} days`
                    : "--"}
                </TableCell>
              </TableRow>

              <TableRow>
  <TableCell>
    Consumption Trend
  </TableCell>

  <TableCell align="right">
    <Typography variant="body1">
      {analysis.consumptionTrend === "UP"
        ? "Increasing"
        : analysis.consumptionTrend === "DOWN"
          ? "Decreasing"
          : "Stable"}
    </Typography>

    {analysis.consumptionTrend !== "STABLE" && (
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {Math.abs(
          analysis.consumptionTrendPercent
        ).toFixed(1)}
        % compared with previous sessions
      </Typography>
    )}
  </TableCell>
</TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Button
        variant="contained"
        onClick={onBack}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}