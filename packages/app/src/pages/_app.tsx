import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource/inter/variable.css";

import { ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

import { myChakraUITheme, myRainbowKitTheme } from "@/lib/theme";
import { chains, wagmiClient } from "@/lib/wallet";

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <ChakraProvider resetCSS theme={myChakraUITheme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} showRecentTransactions={true} theme={myRainbowKitTheme}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default MyApp;
