/* eslint-disable camelcase */
import { Button, FormControl, FormHelperText, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";

import { SocialRecoveryWallet__factory } from "../../../contracts/typechain-types";

export interface PeerMeta {
  name: string;
  url: string;
}

const HomePage: NextPage = () => {
  const router = useRouter();

  const [socialRecoveryWalletAddress, setSocialRecoveryWalletAddress] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const txRecovery = async () => {
    if (!signer || !address) {
      return;
    }
    const contract = SocialRecoveryWallet__factory.connect(socialRecoveryWalletAddress, signer);
    const isOk = contract.isGuardian(address);
    if (!isOk) {
      alert("this account is not guardian");
    }
    await contract.initiateRecovery(newOwner);
    await contract.executeRecovery(newOwner, [address]);
  };

  useEffect(() => {
    setSocialRecoveryWalletAddress(router.query.address as string);
  }, [router]);

  return (
    <DefaultLayout>
      <Stack spacing="8">
        <Stack spacing="4">
          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="lg">To recovery</FormLabel>
              <Text fontSize="xs">{socialRecoveryWalletAddress}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel>NewOwner</FormLabel>
              <Input type="text" fontSize="xs" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
              <FormHelperText fontSize="xs" color="blue.600">
                * please input new owner and execute recovery
              </FormHelperText>
            </FormControl>
            <Button w="full" colorScheme="brand" onClick={txRecovery} isDisabled={!newOwner}>
              Recovery
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </DefaultLayout>
  );
};

export default HomePage;
