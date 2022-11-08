/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.20.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint64 = string;
export type Timestamp = Uint64;
export interface InstantiateMsg {
  admin: string;
  poap_code_id: Uint64;
  poap_instantiate_msg: PoapInstantiateMsg;
}
export interface PoapInstantiateMsg {
  admin: string;
  cw721_code_id: Uint64;
  cw721_instantiate_msg: InstantiateMsg1;
  event_info: EventInfo;
  minter: string;
}
export interface InstantiateMsg1 {
  minter: string;
  name: string;
  symbol: string;
}
export interface EventInfo {
  creator: string;
  end_time: Timestamp;
  per_address_limit: number;
  poap_uri: string;
  start_time: Timestamp;
}
export type ExecuteMsg = {
  claim: {};
} | {
  mint_to: {
    recipient: string;
  };
} | {
  update_admin: {
    new_admin: string;
  };
};
export type QueryMsg = {
  config: {};
};
export type Addr = string;
export interface QueryConfigResponse {
  admin: Addr;
  poap_code_id: number;
  poap_contract_address: Addr;
}