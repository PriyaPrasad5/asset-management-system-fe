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
import { useTranslation } from "react-i18next";
import { FaChartSimple, FaRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { userLogin } from "../../services/authForm";

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const toast = useToast();

  // Toggle language between English & Hindi
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

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
          navigate("/app/create-request");
        } else if (role === "MANAGER") {
          navigate("/app/request-list");
        } else {
          alert(t("Login.invalidRole"));
        }
      } else {
        toast({ title: t("Login.invalidCredentials"), status: "error" });
      }
    }
  }, [mutLogin.isSuccess, mutLogin.data, navigate, t]);

  return (
    <Box w="100%" maxW="400px" minH="100vh" mx="auto" bg="var(--tgsb)">
      <Helmet>
        <title>{t("Login.loginTitle")}</title>
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
        {/* <Image src="/ams.png" w="140px" h="140px" /> */}
      </Center>
      <Stack p="4" w="100%">
        <Center
          data-testid="login-container"
          textAlign={"center"}
          fontWeight={"800"}
          textTransform={"uppercase"}
          p="3"
          borderRadius={"8px"}
          fontSize={"1.25rem"}
          color={"GrayText"}
        >
          <FaChartSimple />
          <Box ml="2">{t("Login.login")}</Box>
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
            <FormLabel>{t("Login.email")}</FormLabel>
            <Input
              size={"lg"}
              {...register("email", {
                required: t("Login.pleaseEnterEmail"),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: t("Login.invalidEmailFormat"),
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <FormLabel>{t("Login.password")}</FormLabel>
            <Input
              type="password"
              size="lg"
              {...register("password", {
                required: t("Login.pleaseEnterPassword"),
                minLength: {
                  value: 8,
                  message: t("Login.passwordMinLength"),
                },
                validate: (value) =>
                  /[A-Z]/.test(value) || t("passwordUppercase"),
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
              {t("Login.login")}
            </Button>
          </Box>
          <Text fontSize="sm" color="gray.600" textAlign="center" mt="4">
            {t("Login.noAccount")}&nbsp;
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/register")}
            >
              {t("Login.register")}
            </Button>
          </Text>
          <Button onClick={toggleLanguage} colorScheme="blue" mb={4}>
            {i18n.language === "en" ? "हिंदी में बदलें" : "Switch to English"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoginPage;
