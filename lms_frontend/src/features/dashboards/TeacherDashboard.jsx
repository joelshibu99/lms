import { Typography, Box } from "@mui/material";

const TeacherDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>

      <Typography>
        Welcome, Teacher. You can manage courses, assignments, and students.
      </Typography>
    </Box>
  );
};

export default TeacherDashboard;
