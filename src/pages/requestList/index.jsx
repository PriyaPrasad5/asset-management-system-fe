import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  approveRequest,
  fetchRequest,
  rejectRequest,
} from "../../services/manager";

const RequestList = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentRequest, setCurrentRequest] = useState(null);
  const [action, setAction] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch requests
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["request"],
    queryFn: fetchRequest,
  });

  // Handle approval/rejection mutation
  const { mutate: handleAction, isLoading: actionLoading } = useMutation({
    mutationFn: (formData) => {
      if (action === "approve") {
        return approveRequest(currentRequest.id, formData);
      }
      return rejectRequest(currentRequest.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["request"]);
      toast({
        title: `${t("ManagerRequestList.successMessage")} ${
          action === "approve"
            ? t("ManagerRequestList.approve")
            : t("ManagerRequestList.reject")
        }`,
        description: `${t("ManagerRequestList.successMessage")} ${
          action === "approve"
            ? t("ManagerRequestList.approve")
            : t("ManagerRequestList.reject")
        } ${t("ManagerRequestList.successMessage")}`,
        status: "success",
      });
      reset();
      onCloseModal();
    },
    onError: (err) => {
      toast({
        title: `${t("ManagerRequestList.error")} ${
          action === "approve"
            ? t("ManagerRequestList.approve")
            : t("ManagerRequestList.reject")
        }`,
        description: err?.message || "An error occurred",
        status: "error",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    if (action === "approve" && (!data.assetId || !data.reason)) {
      toast({
        title: t("ManagerRequestList.error"),
        description: t("ManagerRequestList.assetIdRequired"),
        status: "error",
      });
      return;
    }

    if (action === "reject" && !data.reason) {
      toast({
        title: t("ManagerRequestList.error"),
        description: t("ManagerRequestList.reasonRequired"),
        status: "error",
      });
      return;
    }

    handleAction(data);
  };

  // Open modal for approval/rejection
  const openModal = (request, actionType) => {
    setCurrentRequest(request);
    setAction(actionType);
    onOpen();
  };

  // Close modal and reset state
  const onCloseModal = () => {
    reset(); // Reset form fields
    setCurrentRequest(null); // Clear current request
    setAction(null); // Reset action
    onClose(); // Close the modal
  };

  // Handle errors in fetching requests
  if (isError) {
    console.error("Error fetching request:", error);
    toast({
      title: t("ManagerRequestList.error"),
      description: error.message,
      status: "error",
    });
  }

  // Show spinner while loading requests
  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const requests = data?.data || [];

  return (
    <Box maxW="none" mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {t("ManagerRequestList.requestList")}
      </Text>
      <TableContainer border="1px solid #e2e8f0" borderRadius="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>{t("ManagerRequestList.name")}</Th>
              <Th>{t("ManagerRequestList.type")}</Th>
              <Th>{t("ManagerRequestList.status")}</Th>
              <Th>{t("ManagerRequestList.reason")}</Th>
              <Th>{t("ManagerRequestList.assetId")}</Th>
              <Th>{t("ManagerRequestList.userId")}</Th>
              <Th>{t("ManagerRequestList.action")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request, index) => (
              <Tr key={request.id}>
                <Td>{index + 1}</Td>
                <Td>{request.name}</Td>
                <Td>
                  {request.type
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </Td>
                <Td>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1).toLowerCase()}
                </Td>
                <Td>{request.reason}</Td>
                <Td>{request.assetId}</Td>
                <Td>{request.userId}</Td>
                <Td>
                  {request.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        onClick={() => openModal(request, "approve")}
                      >
                        {t("ManagerRequestList.approve")}
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => openModal(request, "reject")}
                      >
                        {t("ManagerRequestList.reject")}
                      </Button>
                    </>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      {t("ManagerRequestList.cannotModify")}
                    </Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {action === "approve" ? "Approve Request" : "Reject Request"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {action === "approve" && (
                <>
                  <FormControl isInvalid={errors.assetId}>
                    <FormLabel>{t("ManagerRequestList.assetId")}</FormLabel>
                    <Input
                      {...register("assetId", {
                        required: t("ManagerRequestList.assetIdRequired"),
                      })}
                    />
                    <FormErrorMessage>
                      {errors.assetId?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl mt={4} isInvalid={errors.reason}>
                    <FormLabel>
                      {t("ManagerRequestList.approvalComment")}
                    </FormLabel>
                    <Input
                      {...register("reason", {
                        required: t(
                          "ManagerRequestList.approvalReasonRequired"
                        ),
                      })}
                    />
                    <FormErrorMessage>
                      {errors.reason?.message}
                    </FormErrorMessage>
                  </FormControl>
                </>
              )}
              {action === "reject" && (
                <FormControl isInvalid={errors.reason}>
                  <FormLabel>
                    {t("ManagerRequestList.rejectionReason")}
                  </FormLabel>
                  <Input
                    {...register("reason", {
                      required: t("ManagerRequestList.reasonRequired"),
                    })}
                  />
                  <FormErrorMessage>{errors.reason?.message}</FormErrorMessage>
                </FormControl>
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={actionLoading}
              onClick={handleSubmit(onSubmit)}
            >
              {t("common.submit")}
            </Button>
            <Button variant="ghost" onClick={onCloseModal}>
              {t("common.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RequestList;
