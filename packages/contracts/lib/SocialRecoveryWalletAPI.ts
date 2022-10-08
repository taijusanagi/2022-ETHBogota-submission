/* eslint-disable camelcase */
import { SimpleWalletAPI } from "@account-abstraction/sdk";
import { hexConcat } from "ethers/lib/utils";

import {
  SocialRecoveryWallet,
  SocialRecoveryWallet__factory,
  SocialRecoveryWalletDeployer__factory,
} from "../typechain-types";

export class SocialRecoveryWalletAPI extends SimpleWalletAPI {
  walletContract?: SocialRecoveryWallet;
  factory?: any;

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
      this.index,
    ]);
    return hexConcat([this.factory.address, data]);
  }
}
