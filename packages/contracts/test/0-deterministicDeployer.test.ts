/* eslint-disable camelcase */

/**
 ** This copied from @account-abstraction/sdk
 **/

import { SampleRecipient__factory } from "@account-abstraction/utils/dist/src/types";
import { expect } from "chai";
import { hexValue } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { DeterministicDeployer } from "../lib/infinitism/DeterministicDeployer";

const deployer = DeterministicDeployer.instance;

describe("#deterministicDeployer", () => {
  it("deploy deployer", async () => {
    expect(await deployer.isDeployerDeployed()).to.equal(false);
    await deployer.deployDeployer();
    expect(await deployer.isDeployerDeployed()).to.equal(true);
  });
  it("should ignore deploy again of deployer", async () => {
    await deployer.deployDeployer();
  });
  it("should deploy at given address", async () => {
    const ctr = hexValue(new SampleRecipient__factory(ethers.provider.getSigner()).getDeployTransaction().data!);
    const addr = await DeterministicDeployer.getAddress(ctr);
    expect(await deployer.isContractDeployed(addr)).to.equal(false);
    await DeterministicDeployer.deploy(ctr);
    expect(await deployer.isContractDeployed(addr)).to.equal(true);
  });
});
