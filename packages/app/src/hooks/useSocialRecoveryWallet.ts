import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { SocialRecoveryWalletAPI } from "../../../contracts/lib/SocialRecoveryWalletAPI";

export const useSocialRecoveryWallet = () => {
  const { data: signer } = useSigner();
  const [socialRecoveryWallet, setSocialRecoveryWallet] = useState<SocialRecoveryWalletAPI>();

  useEffect(() => {
    if (!signer) {
      return;
    }
    import(`../../../contracts/deployments/${process.env.NETWORK}.json`).then((deployments) => {
      const socialRecoveryWallet = new SocialRecoveryWalletAPI({
        // assuming if signer is not null, provider is also not null
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider: signer.provider!,
        entryPointAddress: deployments.entryPoint,
        owner: signer,
        factoryAddress: deployments.factory,
      });
      setSocialRecoveryWallet(socialRecoveryWallet);
    });
  }, [signer]);

  return { socialRecoveryWallet };
};
