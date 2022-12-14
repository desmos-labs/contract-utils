/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { ServiceFee, Uint128, Decimal, Uint64, InstantiateMsg, Coin, ExecuteMsg, Target, QueryMsg, Addr, QueryConfigResponse, TipsResponse, Tip } from "./Tips.types";
import { TipsQueryClient, TipsClient } from "./Tips.client";
export const tipsQueryKeys = {
  contract: ([{
    contract: "tips"
  }] as const),
  address: (contractAddress: string | undefined) => ([{ ...tipsQueryKeys.contract[0],
    address: contractAddress
  }] as const),
  config: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...tipsQueryKeys.address(contractAddress)[0],
    method: "config",
    args
  }] as const),
  userReceivedTips: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...tipsQueryKeys.address(contractAddress)[0],
    method: "user_received_tips",
    args
  }] as const),
  userSentTips: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...tipsQueryKeys.address(contractAddress)[0],
    method: "user_sent_tips",
    args
  }] as const),
  postReceivedTips: (contractAddress: string | undefined, args?: Record<string, unknown>) => ([{ ...tipsQueryKeys.address(contractAddress)[0],
    method: "post_received_tips",
    args
  }] as const)
};
export const tipsQueries = {
  config: <TData = QueryConfigResponse,>({
    client,
    options
  }: TipsConfigQuery<TData>): UseQueryOptions<QueryConfigResponse, Error, TData> => ({
    queryKey: tipsQueryKeys.config(client?.contractAddress),
    queryFn: () => client ? client.config() : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  userReceivedTips: <TData = TipsResponse,>({
    client,
    args,
    options
  }: TipsUserReceivedTipsQuery<TData>): UseQueryOptions<TipsResponse, Error, TData> => ({
    queryKey: tipsQueryKeys.userReceivedTips(client?.contractAddress, args),
    queryFn: () => client ? client.userReceivedTips({
      user: args.user
    }) : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  userSentTips: <TData = TipsResponse,>({
    client,
    args,
    options
  }: TipsUserSentTipsQuery<TData>): UseQueryOptions<TipsResponse, Error, TData> => ({
    queryKey: tipsQueryKeys.userSentTips(client?.contractAddress, args),
    queryFn: () => client ? client.userSentTips({
      user: args.user
    }) : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  postReceivedTips: <TData = TipsResponse,>({
    client,
    args,
    options
  }: TipsPostReceivedTipsQuery<TData>): UseQueryOptions<TipsResponse, Error, TData> => ({
    queryKey: tipsQueryKeys.postReceivedTips(client?.contractAddress, args),
    queryFn: () => client ? client.postReceivedTips({
      postId: args.postId
    }) : Promise.reject(new Error("Invalid client")),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  })
};
export interface TipsReactQuery<TResponse, TData = TResponse> {
  client: TipsQueryClient | undefined;
  options?: Omit<UseQueryOptions<TResponse, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
    initialData?: undefined;
  };
}
export interface TipsPostReceivedTipsQuery<TData> extends TipsReactQuery<TipsResponse, TData> {
  args: {
    postId: Uint64;
  };
}
export function useTipsPostReceivedTipsQuery<TData = TipsResponse>({
  client,
  args,
  options
}: TipsPostReceivedTipsQuery<TData>) {
  return useQuery<TipsResponse, Error, TData>(tipsQueryKeys.postReceivedTips(client?.contractAddress, args), () => client ? client.postReceivedTips({
    postId: args.postId
  }) : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface TipsUserSentTipsQuery<TData> extends TipsReactQuery<TipsResponse, TData> {
  args: {
    user: string;
  };
}
export function useTipsUserSentTipsQuery<TData = TipsResponse>({
  client,
  args,
  options
}: TipsUserSentTipsQuery<TData>) {
  return useQuery<TipsResponse, Error, TData>(tipsQueryKeys.userSentTips(client?.contractAddress, args), () => client ? client.userSentTips({
    user: args.user
  }) : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface TipsUserReceivedTipsQuery<TData> extends TipsReactQuery<TipsResponse, TData> {
  args: {
    user: string;
  };
}
export function useTipsUserReceivedTipsQuery<TData = TipsResponse>({
  client,
  args,
  options
}: TipsUserReceivedTipsQuery<TData>) {
  return useQuery<TipsResponse, Error, TData>(tipsQueryKeys.userReceivedTips(client?.contractAddress, args), () => client ? client.userReceivedTips({
    user: args.user
  }) : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface TipsConfigQuery<TData> extends TipsReactQuery<QueryConfigResponse, TData> {}
export function useTipsConfigQuery<TData = QueryConfigResponse>({
  client,
  options
}: TipsConfigQuery<TData>) {
  return useQuery<QueryConfigResponse, Error, TData>(tipsQueryKeys.config(client?.contractAddress), () => client ? client.config() : Promise.reject(new Error("Invalid client")), { ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  });
}
export interface TipsClaimFeesMutation {
  client: TipsClient;
  msg: {
    receiver: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useTipsClaimFeesMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, TipsClaimFeesMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, TipsClaimFeesMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.claimFees(msg, fee, memo, funds), options);
}
export interface TipsUpdateSavedTipsHistorySizeMutation {
  client: TipsClient;
  msg: {
    newSize: number;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useTipsUpdateSavedTipsHistorySizeMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, TipsUpdateSavedTipsHistorySizeMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, TipsUpdateSavedTipsHistorySizeMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateSavedTipsHistorySize(msg, fee, memo, funds), options);
}
export interface TipsUpdateAdminMutation {
  client: TipsClient;
  msg: {
    newAdmin: string;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useTipsUpdateAdminMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, TipsUpdateAdminMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, TipsUpdateAdminMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateAdmin(msg, fee, memo, funds), options);
}
export interface TipsUpdateServiceFeeMutation {
  client: TipsClient;
  msg: {
    newFee?: ServiceFee;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useTipsUpdateServiceFeeMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, TipsUpdateServiceFeeMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, TipsUpdateServiceFeeMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateServiceFee(msg, fee, memo, funds), options);
}
export interface TipsSendTipMutation {
  client: TipsClient;
  msg: {
    amount: Coin[];
    target: Target;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useTipsSendTipMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, TipsSendTipMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, TipsSendTipMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.sendTip(msg, fee, memo, funds), options);
}