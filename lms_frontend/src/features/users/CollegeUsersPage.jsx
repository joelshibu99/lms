import { Box, Typography } from "@mui/material";

const CollegeUsersPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        College Users
      </Typography>

      <Typography color="text.secondary">
        Manage teachers and students here.
      </Typography>
    </Box>
  );
};

export default CollegeUsersPage;
