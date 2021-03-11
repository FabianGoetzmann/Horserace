import React, { useEffect, useContext } from "react";
import { Box, Flex, Text, Divider, Button } from "@chakra-ui/react";
import useWindowDimensions from "../../utils/useWindowDimensions";

export const Sidebar: React.FC = () => {

  const { height, width } = useWindowDimensions();

  console.log(height);
  return (
    <Flex
      h={height - 60}
      w="300px"
      right={0}
      top={0}
      position="absolute"
      bg="#252935"
      justify="space-between"
      flexDirection="column"
    >
      Sidebar
    </Flex>
  );
};
