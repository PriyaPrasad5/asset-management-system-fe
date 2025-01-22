import { Box, Button, Center, Image, Stack } from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet";
import { FaListAlt, FaPlusCircle } from "react-icons/fa";
import { FaChartPie, FaDoorOpen } from "react-icons/fa6";
import { Outlet, useNavigate } from "react-router";

const MainLayout = () => {
  return (
    <>
      <Helmet>
        <title>AMS - Welcome</title>
      </Helmet>
      <Stack direction={"row"} w="100%" bg="#f1f1f1" spacing={3} p="2">
        <Box
          w="280px"
          bg="white"
          h="98vh"
          borderRadius={"10px"}
          position={"sticky"}
          border="0px solid #d9d9d9"
          top="5px"
        >
          <SideMenuList />
        </Box>
        <Box w="100%" flex={1}>
          <Box
            bg="var(--tgsh)"
            bgGradient={"linear(to-r, green.200, green.300)"}
            color="#000"
            fontWeight={"800"}
            p="3"
            textAlign={"left"}
            borderRadius={"8px"}
          >
            Asset Management System
          </Box>
          <Box mt="2">
            <Outlet />
          </Box>
        </Box>
      </Stack>
    </>
  );
};

const SideMenuList = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const menuItems = {
    ADMIN: [
      { label: "Create Asset", icon: <FaPlusCircle />, path: "create-asset" },
      { label: "Get Asset", icon: <FaListAlt />, path: "asset-list" },
      { label: "Dashboard", icon: <FaChartPie />, path: "asset-dashboard" },
    ],
    EMPLOYEE: [
      {
        label: "Create Request",
        icon: <FaPlusCircle />,
        path: "create-request",
      },
      { label: "Dashboard", icon: <FaChartPie />, path: "employee-dashboard" },
    ],
    MANAGER: [
      { label: "Get Asset", icon: <FaListAlt />, path: "assets" },
      { label: "Get Requests", icon: <FaChartPie />, path: "request-list" },
      // { label: "Dashboard", icon: <FaChartPie />, path: "dashboard" },
    ],
  };

  const openScreen = (path) => {
    navigate(`/app/${path}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Center
        py="3"
        fontWeight={"800"}
        bg="#fff"
        fontSize={"1.8rem"}
        borderTopRadius={"10px"}
      >
        <Image src="/ams.png" h={"60px"} w={"60px"}/>
      </Center>
      <Stack p="3" mt="3" spacing={3}>
        {menuItems[role]?.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            border={"1px solid #f1f1f1"}
            size="lg"
            colorScheme="blue"
            leftIcon={item.icon}
            onClick={() => openScreen(item.path)}
            style={{ position: "relative" }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
      <Box position={"absolute"} bottom={"0px"} p="3" w="100%">
        <Button
          variant="ghost"
          border={"1px solid #f1f1f1"}
          w="100%"
          size="lg"
          colorScheme="red"
          leftIcon={
            <FaDoorOpen
              style={{ position: "absolute", left: "20px", top: "15px" }}
            />
          }
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </>
  );
};

export default MainLayout;
