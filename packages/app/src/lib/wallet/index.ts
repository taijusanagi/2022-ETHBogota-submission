import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// TODO: update main chain
const targetChain = process.env.NETWORK === "localhost" ? chain.localhost : chain.localhost;

const { chains, provider } = configureChains([targetChain], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "SocialWallet",
  chains,
});

export { chains };

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
