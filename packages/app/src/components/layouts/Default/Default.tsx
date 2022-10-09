import { Box, Button, ButtonGroup, Center, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { useIsDesktop } from "@/hooks/useIsDesktop";

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  // ========== Nextjs ===========
  const router = useRouter();

  // ========== Hook ===========
  const { isDesktop } = useIsDesktop();

  // ========== Memo ===========
  const currentPathBase = useMemo(() => {
    return router.asPath.split("/")[1];
  }, [router]);

  // ========== OnClick ===========
  const onClickAccount = () => {
    router.push("/");
  };

  const onClickGuardian = () => {
    router.push("/guardian");
  };

  const onClickConnect = () => {
    router.push("/connect");
  };

  // ========== Style ===========
  const inActiveProps = {
    bgColor: "white",
    _hover: {
      bgColor: "gray.50",
    },
    _active: {
      bgColor: "gray.100",
    },
  };

  const activeProps = {
    bgColor: "gray.100",
    _hover: {},
    _active: {},
  };

  const accountButtonProps = currentPathBase === "" ? activeProps : inActiveProps;
  const factoryButtonProps = currentPathBase === "guardian" ? activeProps : inActiveProps;
  const connectButtonProps = currentPathBase === "connect" ? activeProps : inActiveProps;

  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Container as="section" maxW="8xl" mb="8">
        <Box as="nav" py="4">
          <Center
            my="4"
            position={"absolute"}
            right="0"
            left="0"
            top={isDesktop ? "0" : undefined}
            bottom={!isDesktop ? "0" : undefined}
            h="8"
          >
            <ButtonGroup bgColor={"white"} py="1" px="1" rounded="xl" shadow="md" size="xs">
              <Button onClick={onClickAccount} {...accountButtonProps}>
                Account
              </Button>
              <Button onClick={onClickConnect} {...connectButtonProps}>
                Connect
              </Button>
              <Button onClick={onClickGuardian} {...factoryButtonProps}>
                Guardian
              </Button>
            </ButtonGroup>
          </Center>
          <Flex justify="space-between" alignItems={"center"} h="8">
            <Text fontSize="xl" fontWeight={"bold"}>
              AA Gateway
            </Text>
            <HStack>
              <ConnectButton showBalance={false} chainStatus="none" />
            </HStack>
          </Flex>
        </Box>
      </Container>
      <Container maxW="2xl">
        <Box py="12" px="8" boxShadow={"base"} borderRadius="2xl" bgColor={"white"}>
          {children}
        </Box>
      </Container>
    </Flex>
  );
};
