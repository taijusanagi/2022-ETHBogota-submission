/* eslint-disable camelcase */
import { EntryPoint, EntryPoint__factory } from "@account-abstraction/contracts";
import { SampleRecipient, SampleRecipient__factory } from "@account-abstraction/utils/dist/src/types";
import { useEffect, useState } from "react";
import { useNetwork, useSigner } from "wagmi";

import { SocialRecoveryWalletAPI } from "../../../contracts/lib/SocialRecoveryWalletAPI";

export const useSocialRecoveryWallet = () => {
  const { data: signer } = useSigner();

  const network = useNetwork();
  const [socialRecoveryWalletAPI, setSocialRecoveryWalletAPI] = useState<SocialRecoveryWalletAPI>();
  const [socialRecoveryWalletAddress, setSocialRecoveryWalletAddress] = useState("");
  const [entryPoint, setEntryPoint] = useState<EntryPoint>();
  const [sampleRecipient, setSampleRecipient] = useState<SampleRecipient>();

  useEffect(() => {
    if (!signer) {
      setSocialRecoveryWalletAPI(undefined);
      setSocialRecoveryWalletAddress("");
      return;
    }
    if (!network.chain || (network.chain.network !== "localhost" && network.chain.network !== "goerli")) {
      alert("please connect goerli network!");
      return;
    }
    import(`../../../contracts/deployments/${network.chain.network}.json`).then((deployments) => {
      const socialRecoveryWalletAPI = new SocialRecoveryWalletAPI({
        // assuming if signer is not null, provider is also not null
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider: signer.provider!,
        entryPointAddress: deployments.entryPoint,
        owner: signer,
        factoryAddress: deployments.factory,
      });
      setSocialRecoveryWalletAPI(socialRecoveryWalletAPI);
      // get create2 address when init the app
      socialRecoveryWalletAPI.getWalletAddress().then((socialRecoveryWalletAddress) => {
        setSocialRecoveryWalletAddress(socialRecoveryWalletAddress);
      });
      // assuming if signer is not null, provider is also not null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entryPoint = EntryPoint__factory.connect(deployments.entryPoint, signer);
      setEntryPoint(entryPoint);

      const sampleRecipient = SampleRecipient__factory.connect(deployments.sampleRecipient, signer);
      setSampleRecipient(sampleRecipient);
    });
  }, [signer, network.chain]);

  return { entryPoint, sampleRecipient, socialRecoveryWalletAPI, socialRecoveryWalletAddress };
};
