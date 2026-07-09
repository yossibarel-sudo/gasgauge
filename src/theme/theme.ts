import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#4CAF50",
    },

    secondary: {
      main: "#2196F3",
    },

    warning: {
      main: "#FFB300",
    },

    error: {
      main: "#D32F2F",
    },

    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;