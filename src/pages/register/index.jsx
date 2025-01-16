import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empId, setEmpId] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    console.log("Registering with", { name, email, password });
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
         <TextField
          label="EmployeeId"
          variant="outlined"
          fullWidth
          margin="normal"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Register
        </Button>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mt: 2 }}
        >
          Already have an account?&nbsp;
          <Button variant="text" onClick={() => navigate("/login")}>Login</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;