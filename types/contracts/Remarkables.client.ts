/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Uint64, Uint128, InstantiateMsg, InstantiateMsg1, Rarity, Coin, ExecuteMsg, QueryMsg, Expiration, Timestamp, AllNftInfoResponseForMetadata, OwnerOfResponse, Approval, NftInfoResponseForMetadata, Metadata, Addr, QueryConfigResponse, QueryRaritiesResponse, TokensResponse } from "./Remarkables.types";
export interface RemarkablesReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<QueryConfigResponse>;
  rarities: () => Promise<QueryRaritiesResponse>;
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
export class RemarkablesQueryClient implements RemarkablesReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.rarities = this.rarities.bind(this);
    this.allNftInfo = this.allNftInfo.bind(this);
    this.tokens = this.tokens.bind(this);
  }

  config = async (): Promise<QueryConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  rarities = async (): Promise<QueryRaritiesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      rarities: {}
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
export interface RemarkablesInterface extends RemarkablesReadOnlyInterface {
  contractAddress: string;
  sender: string;
  mint: ({
    postId,
    rarityLevel,
    remarkablesUri
  }: {
    postId: Uint64;
    rarityLevel: number;
    remarkablesUri: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateRarityMintFees: ({
    newFees,
    rarityLevel
  }: {
    newFees: Coin[];
    rarityLevel: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateAdmin: ({
    newAdmin
  }: {
    newAdmin: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  claimFees: ({
    receiver
  }: {
    receiver: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class RemarkablesClient extends RemarkablesQueryClient implements RemarkablesInterface {
  override client: SigningCosmWasmClient;
  sender: string;
  override contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.mint = this.mint.bind(this);
    this.updateRarityMintFees = this.updateRarityMintFees.bind(this);
    this.updateAdmin = this.updateAdmin.bind(this);
    this.claimFees = this.claimFees.bind(this);
  }

  mint = async ({
    postId,
    rarityLevel,
    remarkablesUri
  }: {
    postId: Uint64;
    rarityLevel: number;
    remarkablesUri: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint: {
        post_id: postId,
        rarity_level: rarityLevel,
        remarkables_uri: remarkablesUri
      }
    }, fee, memo, funds);
  };
  updateRarityMintFees = async ({
    newFees,
    rarityLevel
  }: {
    newFees: Coin[];
    rarityLevel: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_rarity_mint_fees: {
        new_fees: newFees,
        rarity_level: rarityLevel
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
  claimFees = async ({
    receiver
  }: {
    receiver: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      claim_fees: {
        receiver
      }
    }, fee, memo, funds);
  };
}