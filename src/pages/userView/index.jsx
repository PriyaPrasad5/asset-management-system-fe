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
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserDetails } from "../../services/admin";

const UserDetails = () => {
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
        <Text color="red.500">Error: {error.message}</Text>
      </Center>
    );
  }

  const history = data?.data?.history || [];
  const user = history.length > 0 ? history[0]?.user : null;

  return (
    <Box maxW="container.lg" mx="auto" p={6}>
      <Button mb={6} onClick={() => navigate(-1)} variant="ghost">
        Back
      </Button>

      <VStack spacing={8} align="stretch">
        {/* User Details */}
        {user ? (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              User Details
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
                  Name:
                </Text>
                <Text color="gray.800">{user.name}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  Email:
                </Text>
                <Text color="gray.800">{user.email}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  Role:
                </Text>
                <Text color="gray.800">{user.role}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="medium" color="gray.600">
                  Active:
                </Text>
                <Text color="gray.800">{user.isActive ? "Yes" : "No"}</Text>
              </Flex>
            </VStack>
          </Box>
        ) : (
          <Text>No user details available</Text>
        )}

        {/* History */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            History
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
                      Type
                    </Th>
                    <Th color="gray.600" fontWeight="medium">
                      Asset
                    </Th>
                    <Th color="gray.600" fontWeight="medium">
                      Date
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
            <Text>No history available</Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default UserDetails;
