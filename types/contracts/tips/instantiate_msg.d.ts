import { ServiceFee, Uint64 } from "./shared-types";

export interface InstantiateMsg {
/**
 * Address of who will have the right to administer the contract.
 */
admin: string
/**
 * The number of records saved of a user tips history.
 */
saved_tips_threshold: number
/**
 * Fee that the users need to pay to use the contract.
 */
service_fee: ServiceFee
/**
 * Application which is deploying the contract.
 */
subspace_id: Uint64
[k: string]: unknown
}
