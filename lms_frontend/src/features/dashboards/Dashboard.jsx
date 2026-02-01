import { Typography, Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">
        Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Login successful. JWT is working.
      </Typography>
    </Box>
  );
}
