/* eslint-disable camelcase */
import { EntryPoint__factory } from "@account-abstraction/contracts";
import { SampleRecipient__factory } from "@account-abstraction/utils/dist/src/types";
import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

import { DeterministicDeployer } from "../lib/infinitism/DeterministicDeployer";
import { SocialRecoveryWalletDeployer__factory } from "../typechain-types";

async function main() {
  const [signer] = await ethers.getSigners();
  const entryPoint = await new EntryPoint__factory(signer).deploy(1, 1);
  const factoryAddress = await DeterministicDeployer.deploy(SocialRecoveryWalletDeployer__factory.bytecode);
  const sampleRecipient = await new SampleRecipient__factory(signer).deploy();
  const result = {
    entryPoint: entryPoint.address,
    factory: factoryAddress,
    sampleRecipient: sampleRecipient.address,
  };
  fs.writeFileSync(path.join(__dirname, `../deployments/${network.name}.json`), JSON.stringify(result));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
