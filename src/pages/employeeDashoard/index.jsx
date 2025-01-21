import {
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteRequest, fetchRequest } from "../../services/emplyee";

const RequestEmployeeList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch request using useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["request"],
    queryFn: fetchRequest,
  });

  const { mutate: deleteRequestMutation, isLoading: deleteLoading } =
    useMutation({
      mutationFn: (requestId) => deleteRequest(requestId),
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        toast({
          title: "Request Deleted",
          description: "The request has been deleted successfully.",
          status: "success",
        });
        navigate("/employee-dashboard");
      },
      onError: (err) => {
        toast({
          title: "Error deleting asset",
          description: err?.message || "An error occurred",
          status: "error",
        });
      },
    });

  // Handle delete
  const handleDelete = (requestId) => {
    deleteRequestMutation(requestId);
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
                    .join("")}
                </Td>
                <Td>
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1).toLowerCase()}
                </Td>
                <Td>{request.reason}</Td>
                <Td>{request.assetId}</Td>
                <Td>
                  {request.status === "PENDING" ? (
                    <IconButton
                      aria-label="Delete Request"
                      icon={<FaTrash />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(request.id)}
                      isLoading={deleteLoading}
                    />
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      Cannot delete
                    </Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RequestEmployeeList;
