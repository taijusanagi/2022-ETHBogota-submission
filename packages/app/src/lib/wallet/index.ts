import { connectorsForWallets, wallet } from "@rainbow-me/rainbowkit";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Chain, chain, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains([chain.localhost, chain.goerli], [publicProvider()]);

export interface RainbowWeb3AuthConnectorProps {
  chains: Chain[];
}

export const rainbowWeb3AuthConnector = ({ chains }: RainbowWeb3AuthConnectorProps) => {
  return {
    id: "web3auth",
    name: "Web3Auth",
    iconUrl: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
    iconBackground: "#fff",
    createConnector: () => {
      const connector = new Web3AuthConnector({
        chains,
        options: {
          clientId: "BNK6eCkCRwqX3EXouKjJ1OZ1AzsDB3VU8OXfqD9F4BZLpXQJ9SI-IRGJt03AkVK2NQhjHCbnn4xy4Y0SmZYEWAE",
          network: "testnet",
          chainId: "0x5",
          socialLoginConfig: {
            mfaLevel: "default",
          },
        },
      });
      return {
        connector,
      };
    },
  };
};

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rainbowWeb3AuthConnector({ chains: [chain.goerli] }),
      wallet.walletConnect({ chains }),
      wallet.metaMask({ chains }),
      wallet.rainbow({ chains }),
    ],
  },
]);

export { chains };

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
