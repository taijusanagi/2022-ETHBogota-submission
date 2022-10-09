/* eslint-disable camelcase */
import { EntryPoint, EntryPoint__factory } from "@account-abstraction/contracts";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";

import { SocialRecoveryWalletAPI } from "../../../contracts/lib/SocialRecoveryWalletAPI";
import { SocialRecoveryWallet, SocialRecoveryWallet__factory } from "../../../contracts/typechain-types";

export const useSocialRecoveryWallet = () => {
  const { data: signer } = useSigner();
  const { isConnected, address } = useAccount();

  const network = useNetwork();
  const [socialRecoveryWalletAPI, setSocialRecoveryWalletAPI] = useState<SocialRecoveryWalletAPI>();
  const [socialRecoveryWalletAddress, setSocialRecoveryWalletAddress] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);
  const [entryPoint, setEntryPoint] = useState<EntryPoint>();
  const [contract, setContract] = useState<SocialRecoveryWallet>();

  useEffect(() => {
    if (!signer || !isConnected) {
      setSocialRecoveryWalletAPI(undefined);
      setSocialRecoveryWalletAddress("");
      return;
    }

    window.localStorage.setItem("debug", "aa*");

    const connectedNetwork = network.chain?.network ? network.chain.network : "goerli";
    if (connectedNetwork !== "localhost" && connectedNetwork !== "goerli") {
      alert("please connect goerli network!");
      return;
    }
    import(`../../../contracts/deployments/${connectedNetwork}.json`).then((deployments) => {
      const socialRecoveryWalletAPI = new SocialRecoveryWalletAPI({
        // assuming if signer is not null, provider is also not null
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider: signer.provider!,
        entryPointAddress: deployments.entryPoint,
        owner: signer,
        factoryAddress: deployments.factory,
      });
      setSocialRecoveryWalletAPI(socialRecoveryWalletAPI);

      // eslint-disable-next-line no-use-before-define
      const socialRecoveryWalletAddress = window.localStorage.getItem(`${address}:connectedNetwork`);

      if (!socialRecoveryWalletAddress) {
        // get create2 address when init the app
        socialRecoveryWalletAPI.getWalletAddress().then((socialRecoveryWalletAddress) => {
          window.localStorage.setItem(`${address}:connectedNetwork`, socialRecoveryWalletAddress);
          setSocialRecoveryWalletAddress(socialRecoveryWalletAddress);
          signer.provider!.getCode(socialRecoveryWalletAddress).then((code) => setIsDeployed(code !== "0x"));
          const contract = SocialRecoveryWallet__factory.connect(socialRecoveryWalletAddress, signer);
          setContract(contract);
        });
      } else {
        setSocialRecoveryWalletAddress(socialRecoveryWalletAddress);
        signer.provider!.getCode(socialRecoveryWalletAddress).then((code) => setIsDeployed(code !== "0x"));
        const contract = SocialRecoveryWallet__factory.connect(socialRecoveryWalletAddress, signer);
        setContract(contract);
      }

      // assuming if signer is not null, provider is also not null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entryPoint = EntryPoint__factory.connect(deployments.entryPoint, signer);
      setEntryPoint(entryPoint);
    });
  }, [signer, network.chain, isConnected]);

  return { entryPoint, socialRecoveryWalletAPI, socialRecoveryWalletAddress, isDeployed, contract };
};
