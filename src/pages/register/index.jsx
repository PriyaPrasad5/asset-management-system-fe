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
import { useTranslation } from "react-i18next";
import { FaRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../services/authForm";

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  // Toggle language between English & Hindi
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };
  
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
          title: t("Register.registrationSuccess"),
          status: "success",
        });
        navigate("/login"); // Redirect to login page
      } else {
        const errMessage = data?.message || t("Register.unexpectedError");
        toast({
          title: t("Register.registrationFailed"),
          description: errMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (err) => {
      const errMessage = err?.message || t("Register.unexpectedError");
      toast({
        title: t("Register.registrationFailed"),
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
        <Box ml="2">{t("Register.register")}</Box>
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
            <FormLabel>{t("Register.name")}</FormLabel>
            <Input
              size={"lg"}
              {...register("name", {
                required: t("Register.nameRequired"),
                minLength: { value: 3, message: t("Register.nameMinLength") },
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.employeeId}>
            <FormLabel>{t("Register.employeeId")}</FormLabel>
            <Input
              size={"lg"}
              {...register("employeeId", {
                required: t("Register.employeeIdRequired"),
                pattern: { value: /^[0-9]+$/, message: t("Register.employeeIdInvalid") },
              })}
            />
            <FormErrorMessage>
              {errors.employeeId && errors.employeeId.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>{t("email")}</FormLabel>
            <Input
              size={"lg"}
              {...register("email", {
                required: t("Register.emailRequired"),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: t("Register.emailInvalid"),
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>{t("Register.password")}</FormLabel>
            <Input
              type="password"
              size="lg"
              {...register("password", {
                required: t("Register.passwordRequired"),
                minLength: { value: 8, message: t("Register.passwordMinLength") },
                validate: (value) =>
                  /[A-Z]/.test(value) || t("Register.passwordUppercase"),
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
              {t("Register.registerButton")}
            </Button>
          </Box>
          {/* Added Login Link */}
          <Text fontSize="sm" color="gray.600" textAlign="center" mt="4">
            {t("Register.login")} &nbsp;
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/login")}
            >
              {t("Register.login")}
            </Button>
          </Text>

          {/* Language Switcher */}
          <Button
           onClick={toggleLanguage}
          >
            {/* {i18n.language === "en" ? "Switch to Hindi" : "अंग्रेज़ी में बदलें"} */}
            {i18n.language === "en" ? "हिंदी में बदलें" : "Switch to English"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RegisterPage;
