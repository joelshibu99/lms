import { Chip } from "@mui/material";

export default function RiskBadge({ label }) {
  let color = "default";

  if (label === "SAFE") color = "success";
  if (label === "AT_RISK") color = "error";

  return <Chip label={label} color={color} size="small" />;
}
