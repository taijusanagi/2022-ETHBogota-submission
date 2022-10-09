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
  const [guardian, setGuardians] = useState("");
  const [guardian2, setGuardians2] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [inRecovery, setInRecovery] = useState(false);

  const txRecovery = async () => {
    if (!signer || !address) {
      return;
    }
    const contract = SocialRecoveryWallet__factory.connect(socialRecoveryWalletAddress, signer);
    await contract.executeRecovery(newOwner, [guardian, guardian2]).catch((err) => {
      console.log(err.message);
      alert("not enough guardian support");
    });
  };

  useEffect(() => {
    setSocialRecoveryWalletAddress(router.query.address as string);
  }, [router]);

  useEffect(() => {
    if (!signer || !address || !socialRecoveryWalletAddress) {
      return;
    }
    const contract = SocialRecoveryWallet__factory.connect(socialRecoveryWalletAddress, signer);
    contract.isGuardian(address).then((isOk) => {
      setIsOk(isOk);
    });

    contract.inRecovery().then((inRecovery) => {
      setInRecovery(inRecovery);
    });
  }, [signer, address, socialRecoveryWalletAddress]);

  return (
    <DefaultLayout>
      <Stack spacing="8">
        <Stack spacing="4">
          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="md" fontWeight="bold">
                Recovery
              </FormLabel>
              <Text fontSize="xs">{socialRecoveryWalletAddress}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="md" fontWeight="bold">
                IsGuardian
              </FormLabel>
              <Text fontSize="xs">{isOk.toString()}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel fontSize="md" fontWeight="bold">
                InRecovery
              </FormLabel>
              <Text fontSize="xs">{inRecovery.toString()}</Text>
            </FormControl>
          </Stack>

          <Stack spacing="2">
            <FormControl>
              <FormLabel>NewOwner</FormLabel>
              <Input type="text" fontSize="xs" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Gardian 1</FormLabel>
              <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Gardian 2</FormLabel>
              <Input type="text" fontSize="xs" value={guardian2} onChange={(e) => setGuardians2(e.target.value)} />
            </FormControl>
            <Button
              w="full"
              colorScheme="brand"
              onClick={txRecovery}
              isDisabled={!newOwner || !isOk || !inRecovery || !guardian || !guardian2}
            >
              Recovery
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </DefaultLayout>
  );
};

export default HomePage;
