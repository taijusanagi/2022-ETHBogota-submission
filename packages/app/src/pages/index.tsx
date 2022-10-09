/* eslint-disable camelcase */
import { Button, FormControl, FormHelperText, FormLabel, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useSocialRecoveryWallet } from "@/hooks/useSocialRecoveryWallet";

import { NULL_ADDRESS, NULL_BYTES } from "../../../contracts/lib/utils";
import { SocialRecoveryWallet__factory } from "../../../contracts/typechain-types";

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

  const [owner, setOwner] = useState("");

  const deploy = async () => {
    if (!socialRecoveryWalletAPI || !entryPoint || !signer || !address) {
      return;
    }
    await signer.sendTransaction({
      to: socialRecoveryWalletAddress,
      value: parseEther("0.01"),
    });
  };

  const deploy2 = async () => {
    if (!socialRecoveryWalletAPI || !entryPoint || !signer || !address) {
      return;
    }
    const op = await socialRecoveryWalletAPI.createSignedUserOp({
      target: NULL_ADDRESS,
      data: NULL_BYTES,
    });
    await entryPoint.handleOps([op], address);
  };
  useEffect(() => {
    if (!signer || !address || !socialRecoveryWalletAddress) {
      return;
    }
    if (isDeployed) {
      const contract = SocialRecoveryWallet__factory.connect(socialRecoveryWalletAddress, signer);
      contract.owner().then((owner) => {
        setOwner(owner);
      });
    } else {
      setOwner(address);
    }
  }, [signer, address, socialRecoveryWalletAddress, isDeployed]);

  return (
    <DefaultLayout>
      {socialRecoveryWalletAddress && (
        <Stack spacing="8">
          <Stack spacing="4">
            <Stack spacing="2">
              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold">
                  AcountAbstraction Address (ERC 4337)
                </FormLabel>
                <Text fontSize="xs">{socialRecoveryWalletAddress}</Text>
                <FormHelperText fontSize="xs" color="blue.600">
                  * AA address is determined counterfactually by create2
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold">
                  Owner
                </FormLabel>
                <Text fontSize="xs">{owner}</Text>
                <FormHelperText fontSize="xs" color="blue.600">
                  * owner is EOA for demo, but it could be any for easy onboarding
                </FormHelperText>
                <FormHelperText fontSize="xs" color="blue.600">
                  * owner remap after recovery is not implemented for this demo
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold">
                  IsDeployed
                </FormLabel>
                <Text fontSize="xs">{isDeployed.toString()}</Text>
                <FormHelperText fontSize="xs" color="blue.600">
                  * no need to deploy to use acount abstraction wallet
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold">
                  Balance
                </FormLabel>
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
              <Button w="full" isLoading={isWalletConnectLoading} onClick={deploy2} disabled={isDeployed}>
                Deploy
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
