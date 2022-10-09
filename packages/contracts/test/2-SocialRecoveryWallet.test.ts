/* eslint-disable camelcase */

/**
 ** This copied from @account-abstraction/sdk
 **/

import { EntryPoint, EntryPoint__factory, UserOperationStruct } from "@account-abstraction/contracts";
import { SimpleWalletAPI } from "@account-abstraction/sdk";
import { rethrowError } from "@account-abstraction/utils";
import { SampleRecipient, SampleRecipient__factory } from "@account-abstraction/utils/dist/src/types";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Wallet } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { DeterministicDeployer } from "../lib/infinitism/DeterministicDeployer";
import { PaymasterAPI } from "../lib/PaymasterAPI";
import { SocialRecoveryWalletAPI } from "../lib/SocialRecoveryWalletAPI";
import {
  MockPaymaster__factory,
  SocialRecoveryWallet,
  SocialRecoveryWalletDeployer__factory,
} from "../typechain-types";

const provider = ethers.provider;

describe("SocialRecoveryWallet", () => {
  let signer: SignerWithAddress;
  let owner: SignerWithAddress;
  let initiateGuardian: SignerWithAddress;
  let supportGuardian: SignerWithAddress;
  let additionalGuardian: SignerWithAddress;
  let guardians: string[];
  let threshold: number;
  let api: SimpleWalletAPI;
  let entryPoint: EntryPoint;
  let beneficiary: string;
  let recipient: SampleRecipient;
  let walletAddress: string;
  let walletDeployed = false;

  before("init", async () => {
    [signer, owner, initiateGuardian, supportGuardian, additionalGuardian] = await ethers.getSigners();
    entryPoint = await new EntryPoint__factory(signer).deploy(1, 1);
    beneficiary = await signer.getAddress();
    recipient = await new SampleRecipient__factory(signer).deploy();

    // await signer.sendTransaction({ to: paymaster.address, value: parseEther("10") });

    const factoryAddress = await DeterministicDeployer.deploy(SocialRecoveryWalletDeployer__factory.bytecode);
    api = new SocialRecoveryWalletAPI({
      provider,
      entryPointAddress: entryPoint.address,
      owner,
      factoryAddress,
    });
  });

  describe("Same test with SimpleWalletAPI to assure the compatibility", () => {
    it("#getRequestId should match entryPoint.getRequestId", async function () {
      const userOp: UserOperationStruct = {
        sender: "0x".padEnd(42, "1"),
        nonce: 2,
        initCode: "0x3333",
        callData: "0x4444",
        callGasLimit: 5,
        verificationGasLimit: 6,
        preVerificationGas: 7,
        maxFeePerGas: 8,
        maxPriorityFeePerGas: 9,
        paymasterAndData: "0xaaaaaa",
        signature: "0xbbbb",
      };
      const hash = await api.getRequestId(userOp);
      const epHash = await entryPoint.getRequestId(userOp);
      expect(hash).to.equal(epHash);
    });

    it("should deploy to counterfactual address", async () => {
      walletAddress = await api.getWalletAddress();
      expect(await provider.getCode(walletAddress).then((code) => code.length)).to.equal(2);

      await signer.sendTransaction({
        to: walletAddress,
        value: parseEther("0.1"),
      });
      const op = await api.createSignedUserOp({
        target: recipient.address,
        data: recipient.interface.encodeFunctionData("something", ["hello"]),
      });

      await expect(entryPoint.handleOps([op], beneficiary))
        .to.emit(recipient, "Sender")
        .withArgs(anyValue, walletAddress, "hello");
      expect(await provider.getCode(walletAddress).then((code) => code.length)).to.greaterThan(1000);
      walletDeployed = true;
    });

    context("#rethrowError", () => {
      let userOp: UserOperationStruct;
      before(async () => {
        userOp = await api.createUnsignedUserOp({
          target: ethers.constants.AddressZero,
          data: "0x",
        });
        // expect FailedOp "invalid signature length"
        userOp.signature = "0x11";
      });
      it("should parse FailedOp error", async () => {
        await expect(entryPoint.handleOps([userOp], beneficiary).catch(rethrowError)).to.revertedWith(
          "FailedOp: ECDSA: invalid signature length"
        );
      });
      it("should parse Error(message) error", async () => {
        await expect(entryPoint.addStake(0)).to.revertedWith("unstake delay too low");
      });
      it("should parse revert with no description", async () => {
        // use wrong signature for contract..
        const wrongContract = entryPoint.attach(recipient.address);
        await expect(wrongContract.addStake(0)).to.revertedWithoutReason();
      });
    });

    it("should use wallet API after creation without a factory", async function () {
      if (!walletDeployed) {
        this.skip();
      }
      const api1 = new SimpleWalletAPI({
        provider,
        entryPointAddress: entryPoint.address,
        walletAddress,
        owner,
      });
      const op1 = await api1.createSignedUserOp({
        target: recipient.address,
        data: recipient.interface.encodeFunctionData("something", ["world"]),
      });
      await expect(entryPoint.handleOps([op1], beneficiary))
        .to.emit(recipient, "Sender")
        .withArgs(anyValue, walletAddress, "world");
    });
  });

  /**
   ** This social recovery function uses plain ethers
   **/
  describe("Additional Test for Social Recovery", () => {
    let contract: SocialRecoveryWallet;

    before("init", async () => {
      contract = await ethers.getContractAt("SocialRecoveryWallet", walletAddress);
      guardians = [initiateGuardian.address, supportGuardian.address, additionalGuardian.address];
      threshold = 2;
      await contract.connect(owner).setGuardians(guardians, threshold);
    });

    it("should set constructor value", async () => {
      for (const guardian of guardians) {
        expect(await contract.isGuardian(guardian)).to.equal(true);
      }
      expect(await contract.threshold()).to.equal(threshold);
    });

    /**
     ** due to time constrain, only positive test is done
     **/
    it("should work", async () => {
      const newOwner = Wallet.createRandom();
      await contract.connect(initiateGuardian).initiateRecovery(newOwner.address);
      await contract.connect(supportGuardian).supportRecovery(newOwner.address);
      await contract
        .connect(initiateGuardian)
        .executeRecovery(newOwner.address, [initiateGuardian.address, supportGuardian.address]);
      expect(await contract.owner()).to.equal(newOwner.address);

      // double check
      await api.getWalletAddress();
    });
  });
});
