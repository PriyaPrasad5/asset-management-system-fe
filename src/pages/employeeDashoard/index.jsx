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
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteRequest, fetchRequest } from "../../services/emplyee";

const RequestEmployeeList = () => {
  const { t } = useTranslation();
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
          title: t("RequestList.deleted"),
          description: t("RequestList.deleteSuccess"),
          status: "success",
        });
        navigate("/app/employee-dashboard");
      },
      onError: (err) => {
        toast({
          title: t("RequestList.deleteError"),
          description: err?.message || t("common.errorOccurred"),
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
      title: t("RequestList.loadError"),
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
        {t("RequestList.title")}
      </Text>
      <TableContainer border="1px solid #e2e8f0" borderRadius="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>{t("RequestList.name")}</Th>
              <Th>{t("RequestList.type")}</Th>
              <Th>{t("RequestList.status")}</Th>
              <Th>{t("RequestList.reason")}</Th>
              <Th>{t("RequestList.assetId")}</Th>
              <Th>{t("RequestList.action")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request, index) => (
              <Tr key={request.id}>
                <Td>{index + 1}</Td>
                <Td>{request.name}</Td>
                <Td>
                  {t(`RequestList.types.${request.type.toLowerCase()}`, {
                    defaultValue: request.type,
                  })}
                </Td>
                <Td>
                  {t(`RequestList.statuses.${request.status.toLowerCase()}`, {
                    defaultValue: request.status,
                  })}
                </Td>
                <Td>{request.reason}</Td>
                <Td>{request.assetId}</Td>
                <Td>
                  {request.status === "PENDING" ? (
                    <IconButton
                      aria-label={t("RequestList.delete")}
                      icon={<FaTrash />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(request.id)}
                      isLoading={deleteLoading}
                    />
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      {t("RequestList.cannotDelete")}
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
