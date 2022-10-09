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
  const [guardian2, setGuardians2] = useState("");
  const { data: signer } = useSigner();

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const txSetGuardians = async () => {
    if (!contract) {
      return;
    }
    await contract.setGuardians([guardian, guardian2], 2);
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
                <FormLabel fontSize="md" fontWeight="bold">
                  AcountAbstraction Address
                </FormLabel>
                <Text fontSize="xs">{socialRecoveryWalletAddress}</Text>
              </FormControl>
            </Stack>
            <Stack spacing="2">
              <FormControl>
                <FormLabel>Gardian 1</FormLabel>
                <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Gardian 2</FormLabel>
                <Input type="text" fontSize="xs" value={guardian2} onChange={(e) => setGuardians2(e.target.value)} />
              </FormControl>

              <Button w="full" colorScheme="brand" onClick={txSetGuardians} isDisabled={!guardian || !guardian2}>
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
