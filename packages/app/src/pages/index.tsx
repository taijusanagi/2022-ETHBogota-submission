import { Button, FormControl, FormHelperText, FormLabel, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useSocialRecoveryWallet } from "@/hooks/useSocialRecoveryWallet";

import { NULL_ADDRESS, NULL_BYTES } from "../../../contracts/lib/utils";

export interface PeerMeta {
  name: string;
  url: string;
}

const HomePage: NextPage = () => {
  const { socialRecoveryWalletAddress, entryPoint, socialRecoveryWalletAPI, isDeployed, balance } =
    useSocialRecoveryWallet();

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [isWalletConnectLoading] = useState(false);

  const deploy = async () => {
    if (!socialRecoveryWalletAPI || !entryPoint || !signer || !address) {
      return;
    }
    await signer.sendTransaction({
      to: socialRecoveryWalletAddress,
      value: parseEther("0.01"),
    });
    //
    // const op = await socialRecoveryWalletAPI.createSignedUserOp({
    //   target: NULL_ADDRESS,
    //   data: NULL_BYTES,
    // });
    // await entryPoint.handleOps([op], address);
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
                <FormHelperText fontSize="xs" color="blue.600">
                  * AA address is determined counterfactually by create2
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="lg">Is Deployed</FormLabel>
                <Text fontSize="xs">{isDeployed.toString()}</Text>
                <FormHelperText fontSize="xs" color="blue.600">
                  * no need to deploy to use acount abstraction wallet
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="lg">Balance</FormLabel>
                <Text fontSize="xs">{ethers.utils.formatEther(balance)} ETH</Text>
                <FormHelperText fontSize="xs" color="blue.600">
                  * paymaster is not implemented so deposit is required for demo
                </FormHelperText>
                <FormHelperText fontSize="xs" color="blue.600">
                  * This deposit is replaced by token or offchain payment (out of scope now)
                </FormHelperText>
              </FormControl>
            </Stack>
            <Stack>
              <Button
                w="full"
                isLoading={isWalletConnectLoading}
                onClick={deploy}
                // disabled={isDeployed}
                colorScheme="brand"
              >
                Deposit 0.01ETH
                {/* {isDeployed ? "Already deployed" : "Deploy"} */}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </DefaultLayout>
  );
};

export default HomePage;
