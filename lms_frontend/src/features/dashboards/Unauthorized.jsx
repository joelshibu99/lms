import { Box, Typography } from "@mui/material";

const Unauthorized = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        Unauthorized Access
      </Typography>

      <Typography color="text.secondary">
        You do not have permission to view this page.
      </Typography>
    </Box>
  );
};

export default Unauthorized;
