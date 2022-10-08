import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const url = "https://polygon-rpc.com/";

export const accounts = process.env.DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.DEPLOYER_PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
