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
import { fetchAssetStats } from "../../services/admin";

const Dashboard = () => {
  const toast = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assetStats"],
    queryFn: fetchAssetStats,
  });

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    toast({
      title: "Error loading dashboard",
      description: error?.message || "Failed to fetch asset stats.",
      status: "error",
      isClosable: true,
    });
    return (
      <Center minH="100vh">
        <Text color="red.500" fontSize="lg">
          Unable to load dashboard data.
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
        Asset Dashboard
      </Text>

      {/* Summary Section */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>Total Assets</StatLabel>
          <StatNumber>{totalAssets}</StatNumber>
        </Stat>

        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>Assigned Assets</StatLabel>
          <StatNumber>{assignedAssets}</StatNumber>
          <StatHelpText>{assignedPercentageValue}% of total</StatHelpText>
        </Stat>

        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>Available Assets</StatLabel>
          <StatNumber>{availableAssets}</StatNumber>
          <StatHelpText>{availablePercentageValue}% of total</StatHelpText>
        </Stat>

        <Stat border="1px solid #e2e8f0" borderRadius="md" p={4}>
          <StatLabel>Under Maintenance</StatLabel>
          <StatNumber>{underMaintenanceAssets}</StatNumber>
          <StatHelpText>
            {underMaintenancePercentageValue}% of total
          </StatHelpText>
        </Stat>
      </Grid>

      {/* Circular Progress Section */}
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
            Assigned
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
            Available
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
            Under Maintenance
          </Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard;
