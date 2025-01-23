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

  // const mutRegistration = useMutation({ mutationFn: userRegister });

  const mutRegistration = useMutation({
    mutationFn: userRegister,
    onSuccess: (data) => {
      if (data?.status === "success") {
        toast({
          title: "Registration Successful!",
          status: "success",
        });
        navigate("/login"); // Redirect to login page
      } else {
        const errMessage = data?.message || "An unexpected error occurred!";
        console.error("Error in Response:", data);

        toast({
          title: "Registration Failed!",
          description: errMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (err) => {
      console.error("Mutation Error Object:", err);

      const errMessage = err?.message || "An unexpected error occurred!";
      toast({
        title: "Registration Failed!",
        description: errMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data) => {
    mutRegistration.mutate(data);
  };

  return (
    <Box w="100%" maxW="400px" minH="100vh" mx="auto" bg="var(--tgsb)">
      <Center
        textAlign={"center"}
        fontWeight={"800"}
        textTransform={"uppercase"}
        p="3"
        borderRadius={"8px"}
        fontSize={"1.25rem"}
        color={"GrayText"}
      >
        <Box ml="2">REGISTER</Box>
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
              isLoading={mutRegistration.isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Register
            </Button>
          </Box>
          {/* Added Login Link */}
          <Text fontSize="sm" color="gray.600" textAlign="center" mt="4">
            Login &nbsp;
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RegisterPage;
