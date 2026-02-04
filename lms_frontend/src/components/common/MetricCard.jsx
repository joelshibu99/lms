import { Card, CardContent, Typography, Box } from "@mui/material";

const MetricCard = ({ label, value, icon }) => {
  return (
    <Card
      elevation={1}
      sx={{
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            {label}
          </Typography>

          {icon && (
            <Box sx={{ color: "text.secondary" }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ lineHeight: 1.2 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
