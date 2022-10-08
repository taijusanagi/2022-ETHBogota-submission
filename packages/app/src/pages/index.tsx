import { Button, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { NextPage } from "next";
import { NEXT_BUILTIN_DOCUMENT } from "next/dist/shared/lib/constants";
import { useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useSocialRecoveryWallet } from "@/hooks/useSocialRecoveryWallet";

import { SocialRecoveryWalletAPI } from "../../../contracts/lib/SocialRecoveryWalletAPI";

const HomePage: NextPage = () => {
  const [guardian, setGuardians] = useState("");

  const { socialRecoveryWalletAddress } = useSocialRecoveryWallet();

  return (
    <DefaultLayout>
      <Stack spacing="8">
        <Stack spacing="4">
          <Stack spacing="2">
            <FormControl>
              <FormLabel>Your social wallet address</FormLabel>
              <Text fontSize="sm">{socialRecoveryWalletAddress}</Text>
              <FormHelperText fontSize="xs" color="blue.600">
                * social wallet address is determined counterfactually by create2
              </FormHelperText>
            </FormControl>
          </Stack>
          <Stack spacing="2">
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Text fontSize="sm">Not deployed</Text>
            </FormControl>
            <Button w="full">Deploy</Button>
          </Stack>
          <Stack spacing="2">
            <FormControl>
              <FormLabel>Gardian</FormLabel>
              <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
            </FormControl>
            <Button w="full">Set Gardian</Button>
          </Stack>
          <FormControl>
            <FormLabel>Walelt Connect</FormLabel>
            <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
          </FormControl>
          <Button w="full">Connect</Button>
        </Stack>
      </Stack>
    </DefaultLayout>
  );
};

export default HomePage;
