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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  fetchAssets,
  updateAsset,
  deleteAsset,
  filter,
} from "../../services/admin";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AssetList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // For modal visibility
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchDate, setSearchDate] = useState("");

  // Fetch assets using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const { mutate: deleteAssetMutation, isLoading: deleteLoading } = useMutation(
    {
      mutationFn: (assetId) => deleteAsset(assetId), // Pass `assetId` explicitly
      onSuccess: () => {
        queryClient.invalidateQueries(["assets"]);
        toast({
          title: "Asset Deleted",
          description: "The asset has been deleted successfully.",
          status: "success",
        });
        navigate("/app/asset-list");
      },
      onError: (err) => {
        toast({
          title: "Error deleting asset",
          description: err?.message || "An error occurred",
          status: "error",
        });
      },
    }
  );

  const mutUpdateAsset = useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries(["assets"]);
      toast({
        title: "Asset Updated",
        description: "The asset has been updated successfully.",
        status: "success",
      });
      onClose();
      navigate("/app/asset-list");
    },
    onError: (err) => {
      toast({
        title: "Error updating asset",
        description: err?.message || "An error occurred",
        status: "error",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Handle edit (opens modal and sets selected asset)
  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setValue("status", asset.status);
    setValue("warrantyEndDate", asset.warrantyEndDate);
    setValue("nextServiceDate", asset.nextServiceDate);
    onOpen();
  };

  const handleDelete = (assetId, assetStatus) => {
    if (assetStatus === "ASSIGNED") {
      toast({
        title: "Cannot Delete Asset",
        description: "The asset is assigned and cannot be deleted.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    deleteAssetMutation(assetId);
  };

  // Handle form submission in modal
  const onSubmit = (data) => {
    if (!data.status || !data.warrantyEndDate || !data.nextServiceDate) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        // duration: 5000,
        // isClosable: true,
      });
      return;
    }
    mutUpdateAsset.mutate({
      id: selectedAsset.id,
      ...data,
    });
  };

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
              <Th>Asset Identifier</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Purchase Date</Th>
              <Th>Warranty End Date</Th>
              <Th>User Id</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assets.map((asset, index) => (
              <Tr key={asset.id}>
                <Td>{index + 1}</Td>
                <Td>{asset.id}</Td>
                <Td>{asset.assetIdentifier}</Td>
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
                <Td>{asset.userId}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit Asset"
                    icon={<FaEdit />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleEdit(asset)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete Asset"
                    icon={<FaTrash />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(asset.id, asset.status)}
                    isLoading={deleteLoading}
                    isDisabled={asset.status === "ASSIGNED"} // Disable the button if status is ASSIGNED
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal for editing asset */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select {...register("status")}>
                <option value="AVAILABLE">Available</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="ASSIGNED">Assigned</option>
              </Select>
              {errors.status && (
                <Text color="red.500">This field is required</Text>
              )}
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Warranty End Date</FormLabel>
              <Input type="date" {...register("warrantyEndDate")} />
              {errors.warrantyEndDate && (
                <Text color="red.500">This field is required</Text>
              )}
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Next Service Date</FormLabel>
              <Input type="date" {...register("nextServiceDate")} />
              {errors.nextServiceDate && (
                <Text color="red.500">This field is required</Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit(onSubmit)}
              isLoading={mutUpdateAsset.isLoading}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AssetList;
