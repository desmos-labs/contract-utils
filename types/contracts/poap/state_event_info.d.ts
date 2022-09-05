import { Addr, Timestamp } from "./shared-types";

export interface StateEventInfo {
creator: Addr
end_time: Timestamp
poap_uri: string
start_time: Timestamp
[k: string]: unknown
}
