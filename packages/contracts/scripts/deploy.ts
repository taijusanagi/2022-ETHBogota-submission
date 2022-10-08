/* eslint-disable camelcase */
import { EntryPoint__factory } from "@account-abstraction/contracts";
import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

async function main() {
  const [signer] = await ethers.getSigners();
  const entryPoint = await new EntryPoint__factory(signer).deploy(1, 1);
  const result = {
    entryPoint: entryPoint.address,
  };
  fs.writeFileSync(path.join(__dirname, `../deployments/${network.name}.json`), JSON.stringify(result));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
