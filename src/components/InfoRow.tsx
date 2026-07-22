import {
  TableCell,
  TableRow,
} from "@mui/material";

interface InfoRowProps {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}

export default function InfoRow({
  label,
  value,
  valueColor = "white",
  bold = false,
}: InfoRowProps) {
  return (
    <TableRow>
      <TableCell
        sx={{
          color: "white",
          borderBottom: "none",
        }}
      >
        {label}
      </TableCell>

      <TableCell
        align="right"
        sx={{
          color: valueColor,
          fontWeight: bold ? "bold" : "normal",
          borderBottom: "none",
        }}
      >
        {value}
      </TableCell>
    </TableRow>
  );
}