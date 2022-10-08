/* eslint-disable camelcase */
import { SimpleWalletAPI } from "@account-abstraction/sdk";
import { SimpleWalletApiParams } from "@account-abstraction/sdk/dist/src/SimpleWalletAPI";
import { hexConcat } from "ethers/lib/utils";

import {
  SocialRecoveryWallet,
  SocialRecoveryWallet__factory,
  SocialRecoveryWalletDeployer__factory,
} from "../typechain-types";

export interface SocialRecoveryWalletApiParams extends SimpleWalletApiParams {
  guardians: string[];
  threshold: number;
}

export class SocialRecoveryWalletAPI extends SimpleWalletAPI {
  guardians: string[];
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

  async getWalletInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = SocialRecoveryWalletDeployer__factory.connect(this.factoryAddress, this.provider);
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    const ownerAddress = await this.owner.getAddress();
    const data = this.factory.interface.encodeFunctionData("deployWallet", [
      this.entryPointAddress,
      ownerAddress,
      this.guardians,
      this.threshold,
      this.index,
    ]);
    return hexConcat([this.factory.address, data]);
  }
}
