import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
} from "@mui/material";

import { LearningService } from "../services/LearningService";

interface Props {
  onBack: () => void;
}

function formatDate(date: Date) {

  const d =
    String(date.getDate()).padStart(2,"0");

  const m =
    String(date.getMonth()+1).padStart(2,"0");

  return `${d}/${m}/${date.getFullYear()}`;

}

export default function LearningPage({

  onBack,

}: Props) {

  const records =
    LearningService.load()
      .sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime()
      );

  return (

    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        mt: 4,
      }}
    >

      <Typography
        variant="h4"
        gutterBottom
      >
        Learning History
      </Typography>

      <Card>

        <CardContent>

          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table sx={{ minWidth: 760 }}>

            <TableHead>

              <TableRow>

                <TableCell>Date</TableCell>

                <TableCell align="right">
                  Gas (kg)
                </TableCell>

                <TableCell align="right">
                  Hours
                </TableCell>

                <TableCell align="right">
                  Actual kg/h
                </TableCell>

                <TableCell align="right">
                  Factor
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Reason
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {records.map(record => (

                <TableRow key={record.id}>

                  <TableCell>

                    {formatDate(
                      record.createdAt
                    )}

                  </TableCell>

                  <TableCell align="right">

                    {record.gasConsumedKg.toFixed(2)}

                  </TableCell>

                  <TableCell align="right">

                    {record.cookingHours.toFixed(2)}

                  </TableCell>

                  <TableCell align="right">

                    {record.actualKgPerHour.toFixed(2)}

                  </TableCell>

                  <TableCell align="right">

                    {record.correctionFactor.toFixed(2)}

                  </TableCell>

                  <TableCell>

                    <Chip

                      label={
                        record.ignored
                          ? "Ignored"
                          : "Accepted"
                      }

                      color={
                        record.ignored
                          ? "warning"
                          : "success"
                      }

                      size="small"

                    />

                  </TableCell>

                  <TableCell>

                    {record.ignoredReason ?? "-"}

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
            }}
          >

            <Button
              variant="contained"
              onClick={onBack}
            >
              Back to Dashboard
            </Button>

          </Box>

        </CardContent>

      </Card>

    </Box>

  );

}