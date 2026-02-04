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

import { useAuth } from "../../auth/AuthContext";
import { roleRedirect } from "../../routes/roleRedirect";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ ONLY source

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ AuthContext handles API + storage
      const data = await login(email, password);

      // ✅ Role-based redirect
      navigate(roleRedirect(data.role), { replace: true });
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
