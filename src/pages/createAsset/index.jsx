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
import { useNavigate } from "react-router-dom";
import { createAsset } from "../../services/admin";

const AddAssetForm = () => {
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
      assetIdentifier: "",
      purchaseDate: "",
      warrantyEndDate: "",
    },
  });
  const mutAddAsset = useMutation({ mutationFn: createAsset });

  const onSubmit = (data) => {
    mutAddAsset.mutate(data);
  };

  useEffect(() => {
    if (mutAddAsset.isSuccess) {
      toast({ title: "Asset added successfully!", status: "success" });
      navigate("/app/asset-list");
    }

    if (mutAddAsset.isError) {
      toast({
        title: "Error adding asset",
        description: mutAddAsset.error.message,
        status: "error",
      });
    }
  }, [
    mutAddAsset.isSuccess,
    mutAddAsset.isError,
    mutAddAsset.error,
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
      mt="9"
    >
      <Center mb="6" fontWeight="bold" fontSize="lg">
        Add New Asset
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
          <FormLabel>Asset Type</FormLabel>
          <Input
            {...register("type", {
              required: "Asset type is required",
            })}
          />
          <FormErrorMessage>
            {errors.type && errors.type.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.assetIdentifier}>
          <FormLabel>Asset Identifier</FormLabel>
          <Input
            {...register("assetIdentifier", {
              required: "Asset Identifier is required",
              // pattern: {
              //   value: /^[0-9]+$/,
              //   message: "Asset ID must be a number",
              // },
            })}
          />
          <FormErrorMessage>
            {errors.assetIdentifier && errors.assetIdentifier.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.purchaseDate}>
          <FormLabel>Purchase Date</FormLabel>
          <Input
            type="date"
            {...register("purchaseDate", {
              required: "Purchase date is required",
            })}
          />
          <FormErrorMessage>
            {errors.purchaseDate && errors.purchaseDate.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.warrantyEndDate}>
          <FormLabel>Warranty End Date</FormLabel>
          <Input
            type="date"
            {...register("warrantyEndDate", {
              required: "Warranty end date is required",
            })}
          />
          <FormErrorMessage>
            {errors.warrantyEndDate && errors.warrantyEndDate.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="green"
          w="100%"
          onClick={handleSubmit(onSubmit)}
          isLoading={mutAddAsset.isLoading}
        >
          Add Asset
        </Button>
      </Stack>
    </Box>
  );
};

export default AddAssetForm;
