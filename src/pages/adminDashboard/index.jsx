import {
  Box,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { fetchAssetStats } from "../../services/admin";

const Dashboard = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assetStats"],
    queryFn: fetchAssetStats,
  });

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" aria-busy="true" data-testid="loading-spinner"/>
      </Center>
    );
  }

  if (isError) {
    toast({
      title: t("Dashboard.errorTitle"),
      description: error?.message || t("Dashboard.errorDescription"),
      status: "error",
      isClosable: true,
    });
    return (
      <Center minH="100vh">
        <Text color="red.500" fontSize="lg">
          {t("Dashboard.errorMessage")}
        </Text>
      </Center>
    );
  }

  const {
    totalAssets,
    assignedPercentageValue,
    availablePercentageValue,
    underMaintenancePercentageValue,
    assignedAssets,
    availableAssets,
    underMaintenanceAssets,
  } = data?.data;

  return (
    <Box maxW="1000px" mx="auto" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        {t("Dashboard.title")}
      </Text>

      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>{t("Dashboard.totalAssets")}</StatLabel>
          <StatNumber>{totalAssets}</StatNumber>
        </Stat>

        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>{t("Dashboard.assignedAssets")}</StatLabel>
          <StatNumber>{assignedAssets}</StatNumber>
          <StatHelpText>
            {assignedPercentageValue}% {t("Dashboard.ofTotal")}
          </StatHelpText>
        </Stat>

        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>{t("Dashboard.availableAssets")}</StatLabel>
          <StatNumber>{availableAssets}</StatNumber>
          <StatHelpText>
            {availablePercentageValue}% {t("Dashboard.ofTotal")}
          </StatHelpText>
        </Stat>

        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>{t("Dashboard.underMaintenance")}</StatLabel>
          <StatNumber>{underMaintenanceAssets}</StatNumber>
          <StatHelpText>
            {underMaintenancePercentageValue}% {t("Dashboard.ofTotal")}
          </StatHelpText>
        </Stat>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <Box textAlign="center">
          <CircularProgress
            value={assignedPercentageValue}
            color="blue.400"
            size="120px"
            thickness="10px"
          >
            <CircularProgressLabel>
              {assignedPercentageValue}%
            </CircularProgressLabel>
          </CircularProgress>
          <Text mt={2} fontWeight="medium">
            {t("Dashboard.assigned")}
          </Text>
        </Box>

        <Box textAlign="center">
          <CircularProgress
            value={availablePercentageValue}
            color="green.400"
            size="120px"
            thickness="10px"
          >
            <CircularProgressLabel>
              {availablePercentageValue}%
            </CircularProgressLabel>
          </CircularProgress>
          <Text mt={2} fontWeight="medium">
            {t("Dashboard.available")}
          </Text>
        </Box>

        <Box textAlign="center">
          <CircularProgress
            value={underMaintenancePercentageValue}
            color="red.400"
            size="120px"
            thickness="10px"
          >
            <CircularProgressLabel>
              {underMaintenancePercentageValue}%
            </CircularProgressLabel>
          </CircularProgress>
          <Text mt={2} fontWeight="medium">
            {t("Dashboard.underMaintenance")}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard;
