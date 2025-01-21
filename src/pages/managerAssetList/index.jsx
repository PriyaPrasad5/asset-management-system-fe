import {
  Badge,
  Box,
  Button,
  Center,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchAssets, filter } from "../../services/manager";

const ManagerAssetList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchDate, setSearchDate] = useState("");

  // Fetch assets using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  // Handle search for warranty date
  const handleSearch = async () => {
    if (!searchDate) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid date.",
        status: "error",
      });
      return;
    }

    try {
      const response = await filter(searchDate);
      queryClient.setQueryData(["assets"], { data: response.data });
    } catch (err) {
      toast({
        title: "Error searching assets",
        description: err?.message || "An error occurred while searching",
        status: "error",
      });
    }
  };

  if (isError) {
    console.error("Error fetching assets:", error);
    toast({
      title: "Error loading assets",
      description: error.message,
      status: "error",
      // duration: 5000,
      // isClosable: true,
    });
  }

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const assets = data?.data || [];

  return (
    <Box maxW="none" mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Asset List
      </Text>
      {/* Search Input */}
      <Box mb={4} display="flex" alignItems="center">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          placeholder="Search by Warranty Date"
          mr={2}
        />
        <Button colorScheme="blue" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <TableContainer border="1px solid #e2e8f0" borderRadius="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>Asset ID</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Purchase Date</Th>
              <Th>Warranty End Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assets.map((asset, index) => (
              <Tr key={asset.id}>
                <Td>{index + 1}</Td>
                <Td>{asset.assetId}</Td>
                <Td>{asset.name}</Td>
                <Td>{asset.type}</Td>
                <Td>
                  <Badge
                    colorScheme={asset.status === "AVAILABLE" ? "green" : "red"}
                  >
                    {asset.status}
                  </Badge>
                </Td>
                <Td>{new Date(asset.purchaseDate).toLocaleDateString()}</Td>
                <Td>{new Date(asset.warrantyEndDate).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagerAssetList;
