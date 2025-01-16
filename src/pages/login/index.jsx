import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Logging in with", { email, password });
    // Add login logic here
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mt: 2 }}
        >
          Don’t have an account?&nbsp;
          <Button variant="text" onClick={() => navigate("/register")}>Register</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;