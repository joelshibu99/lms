import { Box, Typography, Stack, Divider } from "@mui/material";

/**
 * Standard page wrapper for all dashboards & pages
 * Enforces:
 * - Visual hierarchy
 * - Consistent spacing
 * - Premium SaaS layout
 */
const Page = ({ title, subtitle, actions, children }) => {
  const showHeader = Boolean(title || actions);

  return (
    <Stack
      spacing={4}
      sx={{
        width: "100%",
        maxWidth: 1400,        // prevents ultra-wide ugliness
        mx: "auto",            // centers content properly
      }}
    >
      {/* ---------- Page Header ---------- */}
      {showHeader && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            {title && (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.6px",
                  lineHeight: 1.15,
                }}
              >
                {title}
              </Typography>
            )}

            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.75,
                  color: "text.secondary",
                  maxWidth: 640,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {actions}
            </Stack>
          )}
        </Stack>
      )}

      {/* ---------- Divider ---------- */}
      {showHeader && (
        <Divider
          sx={{
            borderColor: "divider",
          }}
        />
      )}

      {/* ---------- Page Content ---------- */}
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Stack>
  );
};

export default Page;
