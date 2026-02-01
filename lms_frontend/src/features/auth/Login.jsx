import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

import { login as loginApi } from "../../api/auth.api";
import { useAuth } from "../../auth/AuthContext";
import { roleRedirect } from "../../routes/roleRedirect";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginApi({ email, password });
      console.log("LOGIN RESPONSE:", response.data); 
      const accessToken = response.data.access;
      const role = response.data.role;

      login(accessToken, role);

      const redirectPath = roleRedirect(role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Login
          </Typography>

          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
