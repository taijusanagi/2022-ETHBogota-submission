import { Button, FormControl, FormHelperText, FormLabel, Input, Stack, Text } from "@chakra-ui/react";
import WalletConnect from "@walletconnect/client";
import { convertHexToUtf8 } from "@walletconnect/utils";
import { NextPage } from "next";
import { useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useSocialRecoveryWallet } from "@/hooks/useSocialRecoveryWallet";

import { NULL_ADDRESS, NULL_BYTES } from "../../../contracts/lib/utils";

export interface PeerMeta {
  name: string;
  url: string;
}

const HomePage: NextPage = () => {
  const { socialRecoveryWalletAddress, sampleRecipient, entryPoint, socialRecoveryWalletAPI } =
    useSocialRecoveryWallet();
  const network = useNetwork();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [connector, setConnector] = useState<WalletConnect>();
  const [guardian, setGuardians] = useState("");
  const [walletConnectUri, setWalletConnectUri] = useState("");
  const [isWalletConnectLoading, setIsWalletConnectLoading] = useState(false);
  const [walletConnectMode, setWalletConnectMode] = useState<"notConnected" | "connecting" | "connected">(
    "notConnected"
  );
  const [peerMeta, setPeerMeta] = useState<PeerMeta>();

  const deploy = async () => {
    if (!socialRecoveryWalletAPI || !entryPoint || !sampleRecipient || !signer || !address) {
      return;
    }
    // this is null op for just deploy contract wallet
    const op = await socialRecoveryWalletAPI.createSignedUserOp({
      target: sampleRecipient.address,
      data: sampleRecipient.interface.encodeFunctionData("something", ["hello"]),
    });
    await entryPoint.handleOps([op], address);
  };

  const connectWalletConnect = async () => {
    setIsWalletConnectLoading(true);
    const connector = new WalletConnect({
      uri: walletConnectUri,
    });
    setConnector(connector);
    if (!connector.connected) {
      console.log("walletconnect is not connected");
      await connector.createSession();
      console.log("now connected");
    } else {
      console.log("walletconnect is connected");
      await connector.killSession();
      console.log("kill previous sesion");
      await connector.createSession();
      console.log("now connected");
    }

    connector.on("session_request", (error, payload) => {
      console.log("session_request", payload);
      if (error) {
        throw error;
      }
      setPeerMeta(payload.params[0].peerMeta);
      setIsWalletConnectLoading(false);
      setWalletConnectMode("connecting");
    });

    connector.on("call_request", async (error, payload) => {
      console.log("call_request", payload);
      if (error) {
        throw error;
      }
      if (payload.method === "personal_sign") {
        console.log("personal_sign");
        const message = convertHexToUtf8(payload.params[0]);
        console.log("message", message);
        const signature = await signer?.signMessage(message);
        console.log(signature);
        const result = connector.approveRequest({
          id: payload.id,
          result: signature,
        });
        console.log("result", result);
      }
    });

    connector.on("disconnect", (error, payload) => {
      console.log("disconnect", payload);
      if (error) {
        throw error;
      }
    });
  };

  const approveSession = () => {
    console.log("approveSession");
    if (!connector || !network.chain) {
      return;
    }
    connector.approveSession({ chainId: network.chain.id, accounts: [socialRecoveryWalletAddress] });
    setWalletConnectMode("connected");
  };

  const rejectSession = () => {
    console.log("rejectSession");
    if (!connector) {
      return;
    }
    connector.rejectSession();
  };

  return (
    <DefaultLayout>
      {socialRecoveryWalletAddress && (
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
              <Button w="full" isLoading={isWalletConnectLoading} onClick={deploy}>
                Deploy
              </Button>
            </Stack>
            {walletConnectMode === "notConnected" && (
              <Stack spacing="2">
                <FormControl>
                  <FormLabel>Walelt Connect</FormLabel>
                  <Input
                    type="text"
                    fontSize="xs"
                    value={walletConnectUri}
                    onChange={(e) => setWalletConnectUri(e.target.value)}
                  />
                </FormControl>
                <Button w="full" isLoading={isWalletConnectLoading} onClick={connectWalletConnect}>
                  Connect
                </Button>
              </Stack>
            )}
            {peerMeta && (
              <Stack spacing="2">
                <Text fontSize={"xs"}>{peerMeta.url}</Text>
                <Text fontSize={"xs"}>{peerMeta.name}</Text>
              </Stack>
            )}
            {walletConnectMode === "connecting" && (
              <Stack spacing="2">
                <Button onClick={approveSession}>{"Approve"}</Button>
                <Button onClick={rejectSession}>{"Reject"}</Button>
              </Stack>
            )}
            {walletConnectMode === "connected" && (
              <Stack spacing="2">
                <Text>Connected</Text>
              </Stack>
            )}

            <Stack spacing="2">
              <FormControl>
                <FormLabel>Gardian</FormLabel>
                <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
              </FormControl>
              <Button w="full">Set Gardian</Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </DefaultLayout>
  );
};

export default HomePage;
