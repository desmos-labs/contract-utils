import { Addr, Timestamp } from "./shared-types";

/**
 * Response to [`QueryMsg::EventInfo`].
 */
export interface QueryEventInfoResponse {
/**
 * Address of who created the event.
 */
creator: Addr
/**
 * Time at which the event ends.
 */
end_time: Timestamp
/**
 * IPFS uri where the event's metadata are stored
 */
event_uri: string
/**
 * Time at which the event starts.
 */
start_time: Timestamp
[k: string]: unknown
}
