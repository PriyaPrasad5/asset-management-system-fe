import React from "react";
import {
  Box,
  Button,
  Center,
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
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services/admin";

const UserList = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleViewDetails = (userId) => {
    navigate(`/app/user-details/${userId}`);
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    toast({
      title: "Error",
      description: error.message,
      status: "error",
    });
    return null;
  }

  const users = data?.data || [];

  return (
    <Box maxW="container.lg" mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        User List
      </Text>
      <TableContainer border="1px solid #e2e8f0" borderRadius="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Active</Th>
              <Th textAlign="right">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={user.id}>
                <Td>{index + 1}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
                <Td>{user.isActive ? "Yes" : "No"}</Td>
                <Td textAlign="right">
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleViewDetails(user.id)}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
