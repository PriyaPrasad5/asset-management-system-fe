// import React, { useState } from "react";
// import { TextField, Button, Typography, Container, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     console.log("Logging in with", { email, password });
//     // Add login logic here
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
//         <Typography variant="h4" align="center" gutterBottom>
//           Login
//         </Typography>
//         <TextField
//           label="Email"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleLogin}
//           sx={{ mt: 2 }}
//         >
//           Login
//         </Button>
//         <Typography
//           variant="body2"
//           align="center"
//           color="textSecondary"
//           sx={{ mt: 2 }}
//         >
//           Don’t have an account?&nbsp;
//           <Button variant="text" onClick={() => navigate("/register")}>Register</Button>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default LoginPage;

// import React, { useState } from "react";
// import { Box, Button, TextField, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../services/authForm";

// export default function LoginPage({ onLoginSuccess }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const { role } = await login(email, password);
//       onLoginSuccess(role); // Pass role to parent for routing
//     } catch (err) {
//       setError("Invalid login credentials");
//     }
//   };
//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         // background: "url('https://source.unsplash.com/random') center/cover no-repeat",
//       }}
//     >
//       <Box
//         sx={{
//           background: "rgba(255, 255, 255, 0.9)",
//           padding: 4,
//           borderRadius: 2,
//           width: "100%",
//           maxWidth: 400,
//           boxShadow: 3,
//         }}
//       >
//         <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold" }}>
//           Login
//         </Typography>
//         <TextField
//           label="Email"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//           label="Password"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//           onClick={handleLogin}
//         >
//           Login
//         </Button>
//       </Box>
//     </Box>
//   );
// }
import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { FaChartSimple, FaRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { userLogin } from "../../services/authForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const toast = useToast();

  const mutLogin = useMutation({ mutationFn: userLogin });

  const validateLogin = (data) => {
    mutLogin.mutate(data);
  };

  useEffect(() => {
    if (mutLogin.isSuccess) {
      if (mutLogin.data?.status === "success") {
        const token = mutLogin.data?.data.token;
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const { role, id, exp } = tokenPayload;

        // Save data to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", id);
        localStorage.setItem("tokenExpiry", exp);

        // Navigate based on role
        if (role === "ADMIN") {
          navigate("/app/create-asset");
        } else if (role === "EMPLOYEE") {
          navigate("/app/dashboard");
        } else if (role === "MANAGER") {
          navigate("/app/manager");
        } else {
          alert("Invalid role. Please contact support.");
        }
      } else {
        toast({ title: "Invalid username or password!", status: "error" });
      }
    }
  }, [mutLogin.isSuccess, mutLogin.data, navigate]);

  return (
    <Box w="100%" maxW="400px" minH="100vh" mx="auto" bg="var(--tgsb)">
      <Helmet>
        <title>AMS - Login</title>
      </Helmet>
      <Center
        bg="#fff"
        color="white"
        textAlign="center"
        p="2"
        fontWeight={"bold"}
        borderBottomRadius={"15px"}
        fontSize={"1.1rem"}
        mb="5px"
      >
        {/* <Image src="/logo.png" w="140px" /> */}
      </Center>
      <Stack p="4" w="100%">
        <Center
          textAlign={"center"}
          fontWeight={"800"}
          textTransform={"uppercase"}
          p="3"
          borderRadius={"8px"}
          fontSize={"1.25rem"}
          color={"GrayText"}
        >
          <FaChartSimple />
          <Box ml="2"> LOGIN</Box>
        </Center>
        <Stack
          w="100%"
          bg="white"
          borderRadius={"8px"}
          p="40px"
          spacing={5}
          border={"1px solid #9ae6b4"}
        >
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              size={"lg"}
              {...register("email", {
                required: "Please Enter Email",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              size="lg"
              {...register("password", {
                required: "Please Enter Password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                validate: (value) =>
                  /[A-Z]/.test(value) ||
                  "Password must contain at least one uppercase letter",
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Box w="100%">
            <Button
              colorScheme="green"
              w="100%"
              size="lg"
              rightIcon={<FaRightLong />}
              onClick={handleSubmit(validateLogin)}
            >
              Login
            </Button>
          </Box>
          {/* Added Register Link */}
          <Text fontSize="sm" color="gray.600" textAlign="center" mt="4">
            Don’t have an account?&nbsp;
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoginPage;
