import { Button, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";

import { SocialRecoveryWalletAPI } from "../../../../contracts/lib/SocialRecoveryWalletAPI";

const AccountPage: NextPage = () => {
  const [mode, setMode] = useState<"list" | "create">("list");

  const [guardian, setGuardians] = useState("");

  const { address } = useAccount();
  const { data: signer } = useSigner();

  const moveToCreate = () => {
    setMode("create");
  };

  const moveToList = () => {
    setMode("list");
  };

  const deploy = () => {
    if (!signer || !signer.provider) {
      return;
    }
    const provider = signer.provider;

    const api = new SocialRecoveryWalletAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner,
      guardians,
      threshold,
      factoryAddress,
    });
  };

  return (
    <DefaultLayout>
      {mode === "list" && (
        <Stack>
          <Button w="full" onClick={moveToCreate}>
            Create
          </Button>
        </Stack>
      )}
      {mode === "create" && (
        <Stack spacing="8">
          <Stack spacing="2">
            <Stack>
              <Heading size="xs">Create Social Wallet</Heading>
            </Stack>
            <FormControl>
              <FormLabel>Your owner address</FormLabel>
              <Text fontSize="xs">{address}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Gardian</FormLabel>
              <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
              <FormHelperText>* for the simplicity, only one guardian can be set for demo</FormHelperText>
            </FormControl>
          </Stack>
          <HStack>
            <Button w="full" onClick={moveToList}>
              Cancel
            </Button>
            <Button w="full">Deploy</Button>
          </HStack>
        </Stack>
      )}
    </DefaultLayout>
  );
};

export default AccountPage;
