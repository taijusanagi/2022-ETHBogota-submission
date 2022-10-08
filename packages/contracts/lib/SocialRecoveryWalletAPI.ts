/* eslint-disable camelcase */
import { SimpleWalletAPI } from "@account-abstraction/sdk";
import { SimpleWalletApiParams } from "@account-abstraction/sdk/dist/src/SimpleWalletAPI";
import { Signer } from "ethers";
import { hexConcat } from "ethers/lib/utils";

import {
  SocialRecoveryWallet,
  SocialRecoveryWallet__factory,
  // SocialRecoveryWalletDeployer,
  SocialRecoveryWalletDeployer__factory,
} from "../typechain-types";

export interface SocialRecoveryWalletApiParams extends SimpleWalletApiParams {
  guardians: Signer[];
  threshold: number;
}

export class SocialRecoveryWalletAPI extends SimpleWalletAPI {
  guardians: Signer[];
  threshold: number;

  walletContract?: SocialRecoveryWallet;
  factory?: any;

  constructor(params: SocialRecoveryWalletApiParams) {
    super(params);
    this.guardians = params.guardians;
    this.threshold = params.threshold;
  }

  async _getWalletContract(): Promise<SocialRecoveryWallet> {
    if (this.walletContract == null) {
      this.walletContract = SocialRecoveryWallet__factory.connect(await this.getWalletAddress(), this.provider);
    }
    return this.walletContract;
  }

  /**
   * return the value to put into the "initCode" field, if the wallet is not yet deployed.
   * this value holds the "factory" address, followed by this wallet's information
   */
  async getWalletInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = SocialRecoveryWalletDeployer__factory.connect(this.factoryAddress, this.provider);
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData("deployWallet", [
        this.entryPointAddress,
        await this.owner.getAddress(),
        await Promise.all(this.guardians.map((guardian) => guardian.getAddress())),
        this.threshold,
        this.index,
      ]),
    ]);
  }
}
