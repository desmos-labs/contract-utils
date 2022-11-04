import { Addr } from "./shared-types";

/**
 * Response to [QueryMsg::UnclaimedTips].
 */
export interface QueryConfigResponse {
admin: Addr
max_pending_tips: number
max_sent_pending_tips: number
}
