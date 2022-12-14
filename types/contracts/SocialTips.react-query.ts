/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { InstantiateMsg, ExecuteMsg, Uint64, QueryMsg, Addr, QueryConfigResponse, Uint128, QueryUnclaimedSentTipsResponse, PendingTip, Coin, QueryPendingTipsResponse } from "./SocialTips.types";
import { SocialTipsQueryClient, SocialTipsClient } from "./SocialTips.client";
export const socialTipsQueryKeys = {
  contract: ([{
    contract: "socialTips"
  }] as const),
  address: (contractAddress: string | undefined) => ([{ ...socialTipsQueryKeys.contract[0],
    address: contractAddress
  }] as const),
  userPendingTips: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...socialTipsQueryKeys.address(contractAddress)[0],
    method: "user_pending_tips",
    args
  }] as const),
  unclaimedSentTips: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...socialTipsQueryKeys.address(contractAddress)[0],
    method: "unclaimed_sent_tips",
    args
  }] as const),
  config: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...socialTipsQueryKeys.address(contractAddress)[0],
    method: "config",
    args
  }] as const)
};
export const socialTipsQueries = {
  userPendingTips: <TData = QueryPendingTipsResponse,>({
    client,
    args,
    options
  }: SocialTipsUserPendingTipsQuery<TData>): UseQueryOptions<QueryPendingTipsResponse, Error, TData> => ({
    queryKey: socialTipsQueryKeys.userPendingTips(client?.contractAddress, args),
    queryFn: () => client ? client.userPendingTips({
      user: args.user
    }) : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  unclaimedSentTips: <TData = QueryUnclaimedSentTipsResponse,>({
    client,
    args,
    options
  }: SocialTipsUnclaimedSentTipsQuery<TData>): UseQueryOptions<QueryUnclaimedSentTipsResponse, Error, TData> => ({
    queryKey: socialTipsQueryKeys.unclaimedSentTips(client?.contractAddress, args),
    queryFn: () => client ? client.unclaimedSentTips({
      user: args.user
    }) : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  config: <TData = QueryConfigResponse,>({
    client,
    options
  }: SocialTipsConfigQuery<TData>): UseQueryOptions<QueryConfigResponse, Error, TData> => ({
    queryKey: socialTipsQueryKeys.config(client?.contractAddress),
    queryFn: () => client ? client.config() : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  })
};
export interface SocialTipsReactQuery<TResponse, TData = TResponse> {
  client: SocialTipsQueryClient | undefined;
  options?: Omit<UseQueryOptions<TResponse, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
    initialData?: undefined;
  };
}
export interface SocialTipsConfigQuery<TData> extends SocialTipsReactQuery<QueryConfigResponse, TData> {}
export function useSocialTipsConfigQuery<TData = QueryConfigResponse>({
  client,
  options
}: SocialTipsConfigQuery<TData>) {
  return useQuery<QueryConfigResponse, Error, TData>(socialTipsQueryKeys.config(client?.contractAddress), () => client ? client.config() : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface SocialTipsUnclaimedSentTipsQuery<TData> extends SocialTipsReactQuery<QueryUnclaimedSentTipsResponse, TData> {
  args: {
    user: string;
  };
}
export function useSocialTipsUnclaimedSentTipsQuery<TData = QueryUnclaimedSentTipsResponse>({
  client,
  args,
  options
}: SocialTipsUnclaimedSentTipsQuery<TData>) {
  return useQuery<QueryUnclaimedSentTipsResponse, Error, TData>(socialTipsQueryKeys.unclaimedSentTips(client?.contractAddress, args), () => client ? client.unclaimedSentTips({
    user: args.user
  }) : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface SocialTipsUserPendingTipsQuery<TData> extends SocialTipsReactQuery<QueryPendingTipsResponse, TData> {
  args: {
    user: string;
  };
}
export function useSocialTipsUserPendingTipsQuery<TData = QueryPendingTipsResponse>({
  client,
  args,
  options
}: SocialTipsUserPendingTipsQuery<TData>) {
  return useQuery<QueryPendingTipsResponse, Error, TData>(socialTipsQueryKeys.userPendingTips(client?.contractAddress, args), () => client ? client.userPendingTips({
    user: args.user
  }) : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface SocialTipsRemovePendingTipMutation {
  client: SocialTipsClient;
  msg: {
    application: string;
    handle: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useSocialTipsRemovePendingTipMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, SocialTipsRemovePendingTipMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, SocialTipsRemovePendingTipMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.removePendingTip(msg, fee, memo, funds), options);
}
export interface SocialTipsUpdateMaxSentPendingTipsMutation {
  client: SocialTipsClient;
  msg: {
    value: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useSocialTipsUpdateMaxSentPendingTipsMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, SocialTipsUpdateMaxSentPendingTipsMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, SocialTipsUpdateMaxSentPendingTipsMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateMaxSentPendingTips(msg, fee, memo, funds), options);
}
export interface SocialTipsUpdateMaxPendingTipsMutation {
  client: SocialTipsClient;
  msg: {
    value: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useSocialTipsUpdateMaxPendingTipsMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, SocialTipsUpdateMaxPendingTipsMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, SocialTipsUpdateMaxPendingTipsMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateMaxPendingTips(msg, fee, memo, funds), options);
}
export interface SocialTipsUpdateAdminMutation {
  client: SocialTipsClient;
  msg: {
    newAdmin: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useSocialTipsUpdateAdminMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, SocialTipsUpdateAdminMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, SocialTipsUpdateAdminMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateAdmin(msg, fee, memo, funds), options);
}
export interface SocialTipsClaimTipsMutation {
  client: SocialTipsClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useSocialTipsClaimTipsMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, SocialTipsClaimTipsMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, SocialTipsClaimTipsMutation>(({
    client,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.claimTips(fee, memo, funds), options);
}
export interface SocialTipsSendTipMutation {
  client: SocialTipsClient;
  msg: {
    application: string;
    handle: string;
    ownerIndex?: Uint64;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useSocialTipsSendTipMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, SocialTipsSendTipMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, SocialTipsSendTipMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.sendTip(msg, fee, memo, funds), options);
}