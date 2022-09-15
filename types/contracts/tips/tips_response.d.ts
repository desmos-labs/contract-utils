import { Addr, Coin, Uint64 } from "./shared-types";

export interface TipsResponse {
tips: Tip[]
[k: string]: unknown
}
export interface Tip {
amount: Coin[]
post_id?: (Uint64 | null)
receiver: Addr
sender: Addr
[k: string]: unknown
}
