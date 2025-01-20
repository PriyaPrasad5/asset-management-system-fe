import {
  Badge,
  Box,
  Center,
  IconButton,
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
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchAssets } from "../../services/admin";

const AssetList = () => {
  const toast = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  if (isError) {
    console.error("Error fetching assets:", error);
    toast({
      title: "Error loading assets",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
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
    <Box maxW="1000px" mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Asset List
      </Text>
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
              <Th>Actions</Th>
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
                <Td>
                  <IconButton
                    aria-label="Edit Asset"
                    icon={<FaEdit />}
                    colorScheme="blue"
                    size="sm"
                    // onClick={() => handleEdit(asset)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete Asset"
                    icon={<FaTrash />}
                    colorScheme="red"
                    size="sm"
                    // onClick={() => handleDelete(asset)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssetList;
