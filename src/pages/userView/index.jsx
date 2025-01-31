import {
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserDetails } from "../../services/admin";

const UserDetails = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => fetchUserDetails(userId),
  });

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center minH="100vh">
        <Text color="red.500">
          {t("UserDetails.error")}: {error.message}
        </Text>
      </Center>
    );
  }

  const history = data?.data?.history || [];
  const user = history.length > 0 ? history[0]?.user : null;

  return (
    <Box maxW="container.lg" mx="auto" p={6}>
      <Button mb={6} onClick={() => navigate(-1)} variant="ghost">
        {t("UserDetails.back")}
      </Button>

      <VStack spacing={8} align="stretch">
        {/* User Details */}
        {user ? (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {t("UserDetails.title")}
            </Text>
            <VStack
              spacing={4}
              align="stretch"
              bg="gray.50"
              p={6}
              borderRadius="lg"
              shadow="md"
            >
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  {t("UserDetails.name")}:
                </Text>
                <Text color="gray.800">{user.name}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  {t("UserDetails.email")}:
                </Text>
                <Text color="gray.800">{user.email}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  {t("UserDetails.role")}:
                </Text>
                <Text color="gray.800">{user.role}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  {t("UserDetails.active")}:
                </Text>
                <Text color="gray.800">
                  {user.isActive ? t("UserDetails.yes") : t("UserDetails.no")}
                </Text>
              </Flex>
            </VStack>
          </Box>
        ) : (
          <Text>{t("UserDetails.noUserDetails")}</Text>
        )}

        {/* History */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {t("UserDetails.history")}
          </Text>
          {history.length > 0 ? (
            <TableContainer>
              <Table variant="unstyled" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.600" fontWeight="medium">
                      #
                    </Th>
                    <Th color="gray.600" fontWeight="medium">
                      {t("UserDetails.type")}
                    </Th>
                    <Th color="gray.600" fontWeight="medium">
                      {t("UserDetails.asset")}
                    </Th>
                    <Th color="gray.600" fontWeight="medium">
                      {t("UserDetails.date")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {history.map((entry, index) => (
                    <Tr key={entry.id}>
                      <Td>{index + 1}</Td>
                      <Td>{entry.type}</Td>
                      <Td>
                        {entry.Asset.name} ({entry.Asset.type})
                      </Td>
                      <Td>{new Date(entry.createdOn).toLocaleDateString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text>{t("UserDetails.noHistory")}</Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default UserDetails;
