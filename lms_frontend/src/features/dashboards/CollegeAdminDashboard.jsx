import { Typography, Box } from "@mui/material";

const CollegeAdminDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        College Admin Dashboard
      </Typography>

      <Typography>
        Welcome, College Admin. You can manage your college users and courses.
      </Typography>
    </Box>
  );
};

export default CollegeAdminDashboard;
