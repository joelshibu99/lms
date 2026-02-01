import { Typography, Box } from "@mui/material";

const StudentDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>

      <Typography>
        Welcome, Student. You can view courses, assignments, and progress.
      </Typography>
    </Box>
  );
};

export default StudentDashboard;
