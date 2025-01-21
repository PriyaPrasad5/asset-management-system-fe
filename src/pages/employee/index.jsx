import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../services/emplyee";

const AddRequestForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      type: "",
    },
  });
  const mutAddRequest = useMutation({ mutationFn: createRequest });

  const onSubmit = (data) => {
    mutAddRequest.mutate(data);
  };

  useEffect(() => {
    if (mutAddRequest.isSuccess) {
      toast({ title: "Request created successfully!", status: "success" });
      navigate("/employee-dashboard");
    }

    if (mutAddRequest.isError) {
      toast({
        title: "Error creating request",
        description: mutAddRequest.error.message,
        status: "error",
      });
    }
  }, [
    mutAddRequest.isSuccess,
    mutAddRequest.isError,
    mutAddRequest.error,
    navigate,
    toast,
  ]);

  return (
    <Box
      w="100%"
      maxW="500px"
      mx="auto"
      p="6"
      bg="gray.50"
      borderRadius="md"
      boxShadow="md"
    >
      <Center mb="6" fontWeight="bold" fontSize="lg">
        Create New Request
      </Center>
      <Stack spacing="4">
        <FormControl isInvalid={errors.name}>
          <FormLabel>Asset Name</FormLabel>
          <Input
            {...register("name", {
              required: "Asset name is required",
              minLength: {
                value: 3,
                message: "Asset name must be at least 3 characters long",
              },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.type}>
          <FormLabel>Request Type</FormLabel>
          <Select
            {...register("type", {
              required: "Request type is required",
            })}
            placeholder="Select request type"
          >
            <option value="REQUEST_ASSET">Request</option>
            <option value="RETURN_ASSET">Return</option>
          </Select>
          <FormErrorMessage>
            {errors.type && errors.type.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="green"
          w="100%"
          onClick={handleSubmit(onSubmit)}
          isLoading={mutAddRequest.isLoading}
        >
          Create Request
        </Button>
      </Stack>
    </Box>
  );
};

export default AddRequestForm;
