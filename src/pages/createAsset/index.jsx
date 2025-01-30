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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createAsset } from "../../services/admin";

const AddAssetForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Using i18n for translations

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
      toast({ title: t("Asset.successMessage"), status: "success" });
      navigate("/app/asset-list");
    }

    if (mutAddAsset.isError) {
      toast({
        title: t("Asset.errorMessage"),
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
      mt="9"
    >
      <Center mb="6" fontWeight="bold" fontSize="lg">
        {t("Asset.addNewAsset")}
      </Center>
      <Stack spacing="4">
        <FormControl isInvalid={errors.name}>
          <FormLabel>{t("Asset.assetName")}</FormLabel>
          <Input
            {...register("name", {
              required: t("Asset.assetNameRequired"),
              minLength: {
                value: 3,
                message: t("Asset.assetNameLength"),
              },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.type}>
          <FormLabel>{t("Asset.assetType")}</FormLabel>
          <Input
            {...register("type", {
              required: t("Asset.assetTypeRequired"),
            })}
          />
          <FormErrorMessage>
            {errors.type && errors.type.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.assetIdentifier}>
          <FormLabel>{t("Asset.assetIdentifier")}</FormLabel>
          <Input
            {...register("assetIdentifier", {
              required: t("Asset.assetIdentifierRequired"),
            })}
          />
          <FormErrorMessage>
            {errors.assetIdentifier && errors.assetIdentifier.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.purchaseDate}>
          <FormLabel>{t("Asset.purchaseDate")}</FormLabel>
          <Input
            type="date"
            {...register("purchaseDate", {
              required: t("Asset.purchaseDateRequired"),
            })}
          />
          <FormErrorMessage>
            {errors.purchaseDate && errors.purchaseDate.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.warrantyEndDate}>
          <FormLabel>{t("Asset.warrantyEndDate")}</FormLabel>
          <Input
            type="date"
            {...register("warrantyEndDate", {
              required: t("Asset.warrantyEndDateRequired"),
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
          {t("Asset.addAssetButton")}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddAssetForm;
