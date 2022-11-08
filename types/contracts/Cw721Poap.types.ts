/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.20.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {};
};
export type Timestamp = Uint64;
export type Uint64 = string;
export type Addr = string;
export interface AllNftInfoResponse {
  access: OwnerOfResponse;
  info: NftInfoResponseForMetadata;
}
export interface OwnerOfResponse {
  approvals: Approval[];
  owner: string;
}
export interface Approval {
  expires: Expiration;
  spender: string;
}
export interface NftInfoResponseForMetadata {
  extension: Metadata;
  token_uri?: string | null;
}
export interface Metadata {
  claimer: Addr;
}
export type ExecuteMsg = {
  transfer_nft: {
    recipient: string;
    token_id: string;
  };
} | {
  send_nft: {
    contract: string;
    msg: Binary;
    token_id: string;
  };
} | {
  approve: {
    expires?: Expiration | null;
    spender: string;
    token_id: string;
  };
} | {
  revoke: {
    spender: string;
    token_id: string;
  };
} | {
  approve_all: {
    expires?: Expiration | null;
    operator: string;
  };
} | {
  revoke_all: {
    operator: string;
  };
} | {
  mint: MintMsgForMetadata;
} | {
  burn: {
    token_id: string;
  };
} | {
  extension: {
    msg: Empty;
  };
};
export type Binary = string;
export interface MintMsgForMetadata {
  extension: Metadata;
  owner: string;
  token_id: string;
  token_uri?: string | null;
}
export interface Empty {
  [k: string]: unknown;
}
export interface NftInfoResponse {
  extension: Metadata;
  token_uri?: string | null;
}