import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { SocialRecoveryWalletAPI } from "../../../contracts/lib/SocialRecoveryWalletAPI";

export const useSocialRecoveryWallet = () => {
  const { data: signer } = useSigner();
  const [socialRecoveryWalletAPI, setSocialRecoveryWalletAPI] = useState<SocialRecoveryWalletAPI>();
  const [socialRecoveryWalletAddress, setSocialRecoveryWalletAddress] = useState("");

  useEffect(() => {
    if (!signer) {
      setSocialRecoveryWalletAPI(undefined);
      setSocialRecoveryWalletAddress("");
      return;
    }
    import(`../../../contracts/deployments/${process.env.NETWORK}.json`).then((deployments) => {
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
    });
  }, [signer]);

  return { socialRecoveryWalletAPI, socialRecoveryWalletAddress };
};
