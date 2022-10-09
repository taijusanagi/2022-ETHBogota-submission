/* eslint-disable camelcase */
import { Button, FormControl, FormHelperText, FormLabel, Input, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useSocialRecoveryWallet } from "@/hooks/useSocialRecoveryWallet";

import { SocialRecoveryWallet__factory } from "../../../contracts/typechain-types";

export interface PeerMeta {
  name: string;
  url: string;
}

const HomePage: NextPage = () => {
  const router = useRouter();
  const { socialRecoveryWalletAddress, contract } = useSocialRecoveryWallet();
  const [guardian, setGuardians] = useState("");
  const { data: signer } = useSigner();

  const txSetGuardians = async () => {
    if (!contract) {
      return;
    }
    await contract.setGuardians([guardian], 1);
  };

  const onClickLink = () => {
    router.push(`${origin}/recovery?address=${socialRecoveryWalletAddress}`);
  };

  return (
    <DefaultLayout>
      {socialRecoveryWalletAddress && (
        <Stack spacing="8">
          <Stack spacing="4">
            <Stack spacing="2">
              <FormControl>
                <FormLabel fontSize="lg">AcountAbstraction Address</FormLabel>
                <Text fontSize="xs">{socialRecoveryWalletAddress}</Text>
              </FormControl>
            </Stack>

            <Stack spacing="2">
              <FormControl>
                <FormLabel>Gardian</FormLabel>
                <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
                <FormHelperText fontSize="xs" color="blue.600">
                  * only one gardian is set for simple demo
                </FormHelperText>
              </FormControl>
              <Button w="full" colorScheme="brand" onClick={txSetGuardians} isDisabled={!guardian}>
                Set Gardian
              </Button>
            </Stack>
            <Text fontSize="md">Recovery URL to share</Text>
            <Text
              onClick={onClickLink}
              as={Link}
              fontSize="xs"
            >{`${origin}/recovery?address=${socialRecoveryWalletAddress}`}</Text>
          </Stack>
        </Stack>
      )}
    </DefaultLayout>
  );
};

export default HomePage;
