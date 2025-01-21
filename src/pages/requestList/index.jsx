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
import {
  approveRequest,
  fetchRequest,
  rejectRequest,
} from "../../services/manager";

const RequestList = () => {
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["request"],
    queryFn: fetchRequest,
  });

  const { mutate: handleAction, isLoading: actionLoading } = useMutation({
    mutationFn: (formData) => {
      console.log("Current Request ID:", currentRequest?.id);
      return action === "approve"
        ? approveRequest(currentRequest.id, formData)
        : rejectRequest(currentRequest.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["request"]);
      toast({
        title: `Request ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `The request has been ${
          action === "approve" ? "approved" : "rejected"
        } successfully.`,
        status: "success",
      });
      reset();
      onClose();
    },
    onError: (err) => {
      toast({
        title: `Error ${
          action === "approve" ? "approving" : "rejecting"
        } request`,
        description: err?.message || "An error occurred",
        status: "error",
      });
    },
  });

  const openModal = (request, actionType) => {
    setCurrentRequest(request);
    setAction(actionType);
    onOpen();
  };

  const onSubmit = (data) => {
    console.log("Action:", action);
    console.log("Form Data:", data);
    handleAction(data);
  };

  if (isError) {
    console.error("Error fetching request:", error);
    toast({
      title: "Error loading request",
      description: error.message,
      status: "error",
    });
  }

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
        Request List
      </Text>
      <TableContainer border="1px solid #e2e8f0" borderRadius="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Reason</Th>
              <Th>Asset ID</Th>
              <Th>Action</Th>
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
                <Td>
                  {request.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        mr={2}
                        onClick={() => openModal(request, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => openModal(request, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      Cannot modify
                    </Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {action === "approve" ? "Approve Request" : "Reject Request"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {action === "approve" ? (
                <>
                  <FormControl isInvalid={errors.assetId}>
                    <FormLabel>Asset Id</FormLabel>
                    <Input
                      {...register("assetId", {
                        required: "Asset Id is required",
                      })}
                      placeholder="Enter approval assetId"
                    />
                    <FormErrorMessage>
                      {errors.assetId?.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl mt={4} isInvalid={errors.comment}>
                    <FormLabel>Approval Comment</FormLabel>
                    <Input
                      {...register("comment", {
                        required: "Approver comment is required",
                      })}
                      placeholder="Enter comment"
                    />
                    <FormErrorMessage>
                      {errors.comment?.message}
                    </FormErrorMessage>
                  </FormControl>
                </>
              ) : (
                <FormControl isInvalid={errors.reason}>
                  <FormLabel>Rejection Reason</FormLabel>
                  <Input
                    {...register("reason", { required: "Reason is required" })}
                    placeholder="Enter rejection reason"
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
              isDisabled={actionLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
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

export default RequestList;
