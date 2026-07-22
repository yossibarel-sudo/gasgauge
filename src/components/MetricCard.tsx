import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueColor?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  valueColor,
}: MetricCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: "#2A2A2A",
        color: "white",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            color: "#AAAAAA",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mt: 1,
            fontWeight: "bold",
            color: valueColor,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "#AAAAAA",
              display: "block",
              mt: 1,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}