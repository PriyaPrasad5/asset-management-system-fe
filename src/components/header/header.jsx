import { Box, Center, Image } from "@chakra-ui/react";
import React from "react";

const Header = ({ text, disptext }) => {
  return (
    <>
      <Center
        bg="#fff"
        color="white"
        textAlign="center"
        p="2"
        fontWeight={"bold"}
        borderBottomRadius={"15px"}
        fontSize={"1.1rem"}
        mb="5px"
      >
        <Image src="/ams.png" w="140px" />
      </Center>
      {text && disptext && (
        <Box
          p="1"
          color={"GrayText"}
          fontWeight="800"
          textAlign={"Center"}
          fontSize={"1.1rem"}
        >
          {text}
        </Box>
      )}
    </>
  );
};

export default Header;
