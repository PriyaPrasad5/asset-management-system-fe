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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../services/emplyee";

const AddRequestForm = () => {
  const { t } = useTranslation();
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
      toast({ title: t("Request.successMessage"), status: "success" });
      navigate("/app/employee-dashboard");
    }

    if (mutAddRequest.isError) {
      toast({
        title: t("Request.errorMessage"),
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
    t,
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
      mt="16"
    >
      <Center mb="6" fontWeight="bold" fontSize="lg">
        {t("Request.title")}
      </Center>
      <Stack spacing="4">
        <FormControl isInvalid={errors.name}>
          <FormLabel>{t("Request.assetName")}</FormLabel>
          <Input
            {...register("name", {
              required: t("Request.errors.assetNameRequired"),
              minLength: {
                value: 3,
                message: t("Request.errors.assetNameMinLength"),
              },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.type}>
          <FormLabel>{t("Request.requestType")}</FormLabel>
          <Select
            {...register("type", {
              required: t("Request.errors.requestTypeRequired"),
            })}
            placeholder={t("Request.selectRequestType")}
          >
            <option value="REQUEST_ASSET">{t("Request.request")}</option>
            <option value="RETURN_ASSET">{t("Request.return")}</option>
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
          {t("Request.createRequest")}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddRequestForm;
