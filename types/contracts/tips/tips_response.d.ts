import { Addr, Coin } from "./shared-types";

export interface TipsResponse {
tips: Tip[]
[k: string]: unknown
}
export interface Tip {
amount: Coin[]
receiver: Addr
sender: Addr
[k: string]: unknown
}
