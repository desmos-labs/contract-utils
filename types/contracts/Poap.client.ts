/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.21.1.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { Uint64, Timestamp, InstantiateMsg, InstantiateMsg1, EventInfo, ExecuteMsg, QueryMsg, Expiration, Addr, AllNftInfoResponseForMetadata, OwnerOfResponse, Approval, NftInfoResponseForMetadata, Metadata, QueryConfigResponse, QueryEventInfoResponse, QueryMintedAmountResponse, TokensResponse } from "./Poap.types";
export interface PoapReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<QueryConfigResponse>;
  eventInfo: () => Promise<QueryEventInfoResponse>;
  mintedAmount: ({
    user
  }: {
    user: string;
  }) => Promise<QueryMintedAmountResponse>;
  allNftInfo: ({
    includeExpired,
    tokenId
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }) => Promise<AllNftInfoResponseForMetadata>;
  tokens: ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<TokensResponse>;
}
export class PoapQueryClient implements PoapReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.eventInfo = this.eventInfo.bind(this);
    this.mintedAmount = this.mintedAmount.bind(this);
    this.allNftInfo = this.allNftInfo.bind(this);
    this.tokens = this.tokens.bind(this);
  }

  config = async (): Promise<QueryConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  eventInfo = async (): Promise<QueryEventInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      event_info: {}
    });
  };
  mintedAmount = async ({
    user
  }: {
    user: string;
  }): Promise<QueryMintedAmountResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      minted_amount: {
        user
      }
    });
  };
  allNftInfo = async ({
    includeExpired,
    tokenId
  }: {
    includeExpired?: boolean;
    tokenId: string;
  }): Promise<AllNftInfoResponseForMetadata> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_nft_info: {
        include_expired: includeExpired,
        token_id: tokenId
      }
    });
  };
  tokens = async ({
    limit,
    owner,
    startAfter
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<TokensResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      tokens: {
        limit,
        owner,
        start_after: startAfter
      }
    });
  };
}
export interface PoapInterface extends PoapReadOnlyInterface {
  contractAddress: string;
  sender: string;
  enableMint: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  disableMint: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  mint: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  mintTo: ({
    recipient
  }: {
    recipient: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateEventInfo: ({
    endTime,
    startTime
  }: {
    endTime: Timestamp;
    startTime: Timestamp;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateAdmin: ({
    newAdmin
  }: {
    newAdmin: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateMinter: ({
    newMinter
  }: {
    newMinter: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class PoapClient extends PoapQueryClient implements PoapInterface {
  override client: SigningCosmWasmClient;
  sender: string;
  override contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.enableMint = this.enableMint.bind(this);
    this.disableMint = this.disableMint.bind(this);
    this.mint = this.mint.bind(this);
    this.mintTo = this.mintTo.bind(this);
    this.updateEventInfo = this.updateEventInfo.bind(this);
    this.updateAdmin = this.updateAdmin.bind(this);
    this.updateMinter = this.updateMinter.bind(this);
  }

  enableMint = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      enable_mint: {}
    }, fee, memo, funds);
  };
  disableMint = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      disable_mint: {}
    }, fee, memo, funds);
  };
  mint = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint: {}
    }, fee, memo, funds);
  };
  mintTo = async ({
    recipient
  }: {
    recipient: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint_to: {
        recipient
      }
    }, fee, memo, funds);
  };
  updateEventInfo = async ({
    endTime,
    startTime
  }: {
    endTime: Timestamp;
    startTime: Timestamp;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_event_info: {
        end_time: endTime,
        start_time: startTime
      }
    }, fee, memo, funds);
  };
  updateAdmin = async ({
    newAdmin
  }: {
    newAdmin: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_admin: {
        new_admin: newAdmin
      }
    }, fee, memo, funds);
  };
  updateMinter = async ({
    newMinter
  }: {
    newMinter: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_minter: {
        new_minter: newMinter
      }
    }, fee, memo, funds);
  };
}