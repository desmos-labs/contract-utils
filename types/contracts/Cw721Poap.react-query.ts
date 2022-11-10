/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.21.1.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee, Coin } from "@cosmjs/amino";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Expiration, Timestamp, Uint64, Addr, AllNftInfoResponse, OwnerOfResponse, Approval, NftInfoResponseForMetadata, Metadata, ExecuteMsg, Binary, MintMsgForMetadata, Empty, NftInfoResponse } from "./Cw721Poap.types";
import { Cw721PoapClient } from "./Cw721Poap.client";
export interface Cw721PoapExtensionMutation {
  client: Cw721PoapClient;
  msg: {
    msg: Empty;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapExtensionMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapExtensionMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapExtensionMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.extension(msg, fee, memo, funds), options);
}
export interface Cw721PoapBurnMutation {
  client: Cw721PoapClient;
  msg: {
    tokenId: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapBurnMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapBurnMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapBurnMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.burn(msg, fee, memo, funds), options);
}
export interface Cw721PoapMintMutation {
  client: Cw721PoapClient;
  msg: MintMsgForMetadata;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapMintMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapMintMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapMintMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.mint(msg, fee, memo, funds), options);
}
export interface Cw721PoapRevokeAllMutation {
  client: Cw721PoapClient;
  msg: {
    operator: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapRevokeAllMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapRevokeAllMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapRevokeAllMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.revokeAll(msg, fee, memo, funds), options);
}
export interface Cw721PoapApproveAllMutation {
  client: Cw721PoapClient;
  msg: {
    expires?: Expiration;
    operator: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapApproveAllMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapApproveAllMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapApproveAllMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.approveAll(msg, fee, memo, funds), options);
}
export interface Cw721PoapRevokeMutation {
  client: Cw721PoapClient;
  msg: {
    spender: string;
    tokenId: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapRevokeMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapRevokeMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapRevokeMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.revoke(msg, fee, memo, funds), options);
}
export interface Cw721PoapApproveMutation {
  client: Cw721PoapClient;
  msg: {
    expires?: Expiration;
    spender: string;
    tokenId: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapApproveMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapApproveMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapApproveMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.approve(msg, fee, memo, funds), options);
}
export interface Cw721PoapSendNftMutation {
  client: Cw721PoapClient;
  msg: {
    contract: string;
    msg: Binary;
    tokenId: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapSendNftMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapSendNftMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapSendNftMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.sendNft(msg, fee, memo, funds), options);
}
export interface Cw721PoapTransferNftMutation {
  client: Cw721PoapClient;
  msg: {
    recipient: string;
    tokenId: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useCw721PoapTransferNftMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, Cw721PoapTransferNftMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, Cw721PoapTransferNftMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.transferNft(msg, fee, memo, funds), options);
}