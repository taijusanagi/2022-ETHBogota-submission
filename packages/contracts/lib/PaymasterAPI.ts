import { UserOperationStruct } from "@account-abstraction/contracts";

export class PaymasterAPI {
  paymasterAddress: string;

  constructor(paymasterAddress: string) {
    this.paymasterAddress = paymasterAddress;
  }

  async getPaymasterAndData(userOp: Partial<UserOperationStruct>): Promise<string> {
    return this.paymasterAddress;
  }
}
