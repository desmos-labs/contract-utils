import { Addr, ServiceFee, Uint64 } from "./shared-types";

export interface QueryConfigResponse {
/**
 * Address of the contract administrator.
 */
admin: Addr
/**
 * Fee required to execute [`ExecuteMsg::SendTip`].
 */
service_fee?: (ServiceFee | null)
/**
 * Application that distributed the contract.
 */
subspace_id: Uint64
/**
 * The number of records saved of a user tips history.
 */
tips_history_size: number
[k: string]: unknown
}
