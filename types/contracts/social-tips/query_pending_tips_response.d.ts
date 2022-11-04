import { PendingTip } from "./shared-types";

/**
 * Response to [QueryMsg::UserPendingTips].
 */
export interface QueryPendingTipsResponse {
tips: PendingTip[]
}
