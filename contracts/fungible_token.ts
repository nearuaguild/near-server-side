import BN from "bn.js";
import { Account, Contract, providers } from "near-api-js";

export interface ChangeMethodOptions {
  gas?: BN;
  attachedDeposit?: BN;
  walletMeta?: string;
  walletCallbackUrl?: string;
}

export class FungibleTokenContract extends Contract {
  constructor(account: Account, contractId: string) {
    super(account, contractId, {
      changeMethods: ["ft_transfer"],
      viewMethods: ["get_claiming_key"],
    });
  }

  public ftTransfer = async (
    args: {
      receiver_id: string;
      amount: string;
      memo?: string;
    },
    options?: ChangeMethodOptions
  ): Promise<void> => {
    return providers.getTransactionLastResult(
      await this.ftTransferRaw(args, options)
    );
  };

  public ftTransferRaw = async (
    args: {
      receiver_id: string;
      amount: string;
      memo?: string;
    },
    options?: ChangeMethodOptions
  ): Promise<providers.FinalExecutionOutcome> => {
    return this.account.functionCall({
      contractId: this.contractId,
      methodName: "ft_transfer",
      args,
      ...options,
    });
  };

  public ftBalanceOf = (
    args: {
      account_id: string;
    },
    options?: ChangeMethodOptions
  ): Promise<string> => {
    return this.account.viewFunctionV2({
      contractId: this.contractId,
      methodName: "ft_balance_of",
      args,
      ...options,
    });
  };
}
