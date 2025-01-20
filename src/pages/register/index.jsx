import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../services/authForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeId: "",
    },
  });

  const mutRegistration = useMutation({ mutationFn: userRegister });

  const onSubmit = (data) => {
    mutRegistration.mutate(data);
  };

  useEffect(() => {
    if (mutRegistration.isSuccess) {
      // Handle success response after mutation is successful
      toast({ title: "Registration Successful!", status: "success" });
      navigate("/login"); // Redirect to login page
    } else if (mutRegistration.isError) {
      // Handle error response if mutation fails
      const errMessage = mutRegistration.error?.message || "An error occurred!";
      toast({
        title: "Registration Failed!",
        description: errMessage,
        status: "error",
      });
    }
  }, [
    mutRegistration.isSuccess,
    mutRegistration.isError,
    mutRegistration.error,
    navigate,
    toast,
  ]);

  return (
    <Box w="100%" maxW="400px" minH="100vh" mx="auto" bg="var(--tgsb)">
      <Center
        bg="#fff"
        color="white"
        textAlign="center"
        p="2"
        fontWeight={"bold"}
        mb="5px"
      >
        <Box fontSize={"1.1rem"}>Register</Box>
      </Center>

      <Stack p="4" w="100%">
        <Stack
          w="100%"
          bg="white"
          borderRadius={"8px"}
          p="40px"
          spacing={5}
          border={"1px solid #9ae6b4"}
        >
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              size={"lg"}
              {...register("name", {
                required: "Please Enter Name",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
                },
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.employeeId}>
            <FormLabel>Employee ID</FormLabel>
            <Input
              size={"lg"}
              {...register("employeeId", {
                required: "Please Enter Employee ID",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Employee ID must be a number",
                },
              })}
            />
            <FormErrorMessage>
              {errors.employeeId && errors.employeeId.message}
            </FormErrorMessage>
          </FormControl>

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
              isLoading={mutRegistration.isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Register
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RegisterPage;
