import { Box } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <Box w="100%" minH={"90vh"} data-testid="outlet">
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
