import { Typography, Box } from "@mui/material";

const SystemAdminDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        System Admin Dashboard
      </Typography>

      <Typography>
        Welcome, System Admin. You have full platform access.
      </Typography>
    </Box>
  );
};

export default SystemAdminDashboard;
