import { ServiceFee, Uint64 } from "./shared-types";

export type ExecuteMsg = ({
send_tip: {
/**
 * Tip target.
 */
target: Target
[k: string]: unknown
}
} | {
update_service_fee: {
/**
 * New service fee required to execute [`ExecuteMsg::SendTip`].
 */
new_fee: ServiceFee
[k: string]: unknown
}
} | {
update_admin: {
/**
 * Address of the new contract admin.
 */
new_admin: string
[k: string]: unknown
}
} | {
update_saved_tips_record_threshold: {
/**
 * New tip records threshold.
 */
new_threshold: number
[k: string]: unknown
}
} | {
claim_fees: {
/**
 * Address to which fees will be sent.
 */
receiver: string
[k: string]: unknown
}
})
/**
 * Enum that represents a tip target.
 */
export type Target = ({
content_target: {
/**
 * Post id.
 */
post_id: Uint64
[k: string]: unknown
}
} | {
user_target: {
/**
 * Address of the user that will receive the tip.
 */
receiver: string
[k: string]: unknown
}
})
