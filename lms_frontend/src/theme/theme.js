import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#0f172a",   // app background
      paper: "#111827",     // cards, tables
    },

    primary: {
      main: "#3b82f6",      // blue accent
    },

    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },

    divider: "#1f2937",
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",

    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },

    h5: {
      fontWeight: 600,
    },

    subtitle2: {
      fontSize: "0.75rem",
      color: "#9ca3af",
    },
  },

  shadows: [
    "none",
    "0px 1px 2px rgba(0,0,0,0.4)",
    "0px 4px 12px rgba(0,0,0,0.45)",
    "0px 10px 30px rgba(0,0,0,0.6)",
    ...Array(21).fill("none"),
  ],

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.6)",
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: "hidden",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
