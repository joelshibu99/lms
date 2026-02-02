import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

const AppHeader = () => {
  const { auth, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">LMS</Typography>

        {auth?.token && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
