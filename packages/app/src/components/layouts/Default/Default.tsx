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
  // const onClickId = () => {
  //   router.push("/account");
  // };

  // ========== Style ===========
  // const inActiveProps = {
  //   bgColor: "white",
  //   _hover: {
  //     bgColor: "gray.50",
  //   },
  //   _active: {
  //     bgColor: "gray.100",
  //   },
  // };

  // const activeProps = {
  //   bgColor: "gray.100",
  //   _hover: {},
  //   _active: {},
  // };

  // const idButtonProps = currentPathBase === "account" ? activeProps : inActiveProps;
  // const factoryButtonProps = currentPathBase === "factory" ? activeProps : inActiveProps;

  return (
    <Flex minHeight={"100vh"} direction={"column"}>
      <Container as="section" maxW="8xl">
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
            {/* <ButtonGroup bgColor={"white"} py="1" px="1" rounded="xl" shadow="md" size="xs">
              <Button onClick={onClickId} {...idButtonProps}>
                Account
              </Button>
              <Button {...factoryButtonProps}>TODO</Button>
            </ButtonGroup> */}
          </Center>
          <Flex justify="space-between" alignItems={"center"} h="8">
            <Text fontSize="xl" fontWeight={"bold"}>
              SocialWallet
            </Text>
            <HStack>
              <ConnectButton showBalance={false} />
            </HStack>
          </Flex>
        </Box>
      </Container>
      <Container flex={1} maxW="8xl" py="8">
        {children}
      </Container>
    </Flex>
  );
};
