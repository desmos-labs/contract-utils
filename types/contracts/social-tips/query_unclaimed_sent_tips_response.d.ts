import { PendingTip } from "./shared-types";

/**
 * Response to [QueryMsg::UnclaimedTips].
 */
export interface QueryUnclaimedSentTipsResponse {
tips: PendingTip[]
}
