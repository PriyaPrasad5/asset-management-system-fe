import {
  Badge,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteAsset,
  fetchAssets,
  filter,
  updateAsset,
} from "../../services/admin";

const AssetList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // For modal visibility
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const { t } = useTranslation();

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
          title: t("Asset.assetDeleted"),
          description: t("Asset.assetDeletedDesc"),
          status: "success",
        });
        navigate("/app/asset-list");
      },
      onError: (err) => {
        toast({
          title: t("Asset.errorDeletingAsset"),
          description: err?.message || t("Asset.errorOccurred"),
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
        title: t("Asset.assetUpdated"),
        description: t("Asset.assetUpdatedDesc"),
        status: "success",
      });
      onClose();
      navigate("/app/asset-list");
    },
    onError: (err) => {
      toast({
        title: t("Asset.errorUpdatingAsset"),
        description: err?.message || t("Asset.errorOccurred"),
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
        title: t("Asset.cannotDeleteAsset"),
        description: t("Asset.assignedAssetCannotDelete"),
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
        title: t("Asset.validationError"),
        description: t("Asset.allFieldsRequired"),
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
        title: t("Asset.validationError"),
        description: t("Asset.enterValidDate"),
        status: "error",
      });
      return;
    }

    try {
      const response = await filter(searchDate);
      queryClient.setQueryData(["assets"], { data: response.data });
    } catch (err) {
      toast({
        title: t("Asset.errorSearchingAssets"),
        description: err?.message || t("Asset.errorOccurred"),
        status: "error",
      });
    }
  };

  if (isError) {
    console.error("Error fetching assets:", error);
    toast({
      title: t("Asset.error"),
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
        {t("Asset.assetList")}
      </Text>
      {/* Search Input */}
      <Box mb={4} display="flex" alignItems="center">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          placeholder={t("Asset.searchByDate")}
          mr={2}
        />
        <Button colorScheme="blue" onClick={handleSearch}>
          {t("Asset.search")}
        </Button>
      </Box>
      <TableContainer border="1px solid #e2e8f0" borderRadius="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>{t("Asset.assetId")}</Th>
              <Th>{t("Asset.assetIdentifier")}</Th>
              <Th>{t("Asset.name")}</Th>
              <Th>{t("Asset.type")}</Th>
              <Th>{t("Asset.status")}</Th>
              <Th>{t("Asset.purchaseDate")}</Th>
              <Th>{t("Asset.warrantyEndDate")}</Th>
              <Th>{t("Asset.userId")}</Th>
              <Th>{t("Asset.actions")}</Th>
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
                  <Tooltip
                    label={
                      asset.status === "ASSIGNED"
                        ? "Cannot edit assigned assets"
                        : ""
                    }
                    shouldWrapChildren
                  >
                    <IconButton
                      aria-label="Edit Asset"
                      icon={<FaEdit />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleEdit(asset)}
                      mr={2}
                      isDisabled={asset.status === "ASSIGNED"}
                    />
                  </Tooltip>
                  <Tooltip
                    label={
                      asset.status === "ASSIGNED"
                        ? "Cannot delete assigned assets"
                        : ""
                    }
                    shouldWrapChildren
                  >
                    <IconButton
                      aria-label={t("Asset.deleteAsset")}
                      icon={<FaTrash />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(asset.id, asset.status)}
                      isLoading={deleteLoading}
                      isDisabled={asset.status === "ASSIGNED"} // Disable the button if status is ASSIGNED
                    />
                  </Tooltip>
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
          <ModalHeader>{t("Asset.editAsset")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>{t("Asset.status")}</FormLabel>
              <Select {...register("status")}>
                <option value="AVAILABLE">{t("Asset.available")}</option>
                <option value="UNDER_MAINTENANCE">
                  {t("Asset.underMaintenance")}
                </option>
                <option value="ASSIGNED">{t("Asset.assigned")}</option>
              </Select>
              {errors.status && (
                <Text color="red.500">{t("Asset.requiredField")}</Text>
              )}
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>{t("Asset.warrantyEndDate")}</FormLabel>
              <Input type="date" {...register("warrantyEndDate")} />
              {errors.warrantyEndDate && (
                <Text color="red.500">{t("Asset.requiredField")}</Text>
              )}
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>{t("Asset.nextServiceDate")}</FormLabel>
              <Input type="date" {...register("nextServiceDate")} />
              {errors.nextServiceDate && (
                <Text color="red.500">{t("Asset.requiredField")}</Text>
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
              {t("Asset.update")}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {t("Asset.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AssetList;
