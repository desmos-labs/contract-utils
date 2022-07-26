/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export interface InstantiateMsg {
  admin?: string | null;
  max_pending_tips: number;
  max_sent_pending_tips: number;
}
export type ExecuteMsg = {
  send_tip: {
    application: string;
    handle: string;
    owner_index?: Uint64 | null;
  };
} | {
  claim_tips: {};
} | {
  update_admin: {
    new_admin: string;
  };
} | {
  update_max_pending_tips: {
    value: number;
  };
} | {
  update_max_sent_pending_tips: {
    value: number;
  };
} | {
  remove_pending_tip: {
    application: string;
    handle: string;
  };
};
export type Uint64 = string;
export type QueryMsg = {
  user_pending_tips: {
    user: string;
  };
} | {
  unclaimed_sent_tips: {
    user: string;
  };
} | {
  config: {};
};
export type Addr = string;
export interface QueryConfigResponse {
  admin: Addr;
  max_pending_tips: number;
  max_sent_pending_tips: number;
}
export type Uint128 = string;
export interface QueryUnclaimedSentTipsResponse {
  tips: PendingTip[];
}
export interface PendingTip {
  amount: Coin[];
  block_height: number;
  sender: Addr;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface QueryPendingTipsResponse {
  tips: PendingTip[];
}