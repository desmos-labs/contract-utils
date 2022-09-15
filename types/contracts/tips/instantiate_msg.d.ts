import { ServiceFee, Uint64 } from "./shared-types";

export interface InstantiateMsg {
/**
 * Address of who will have the right to manage the contract.
 */
admin: string
/**
 * Fee that the users need to pay to use the contract. If `None` no fees will be collected from the tipped amount.
 */
service_fee?: (ServiceFee | null)
/**
 * Application which is deploying the contract.
 */
subspace_id: Uint64
/**
 * The number of records saved of a user tips history.
 */
tips_history_size: number
[k: string]: unknown
}
