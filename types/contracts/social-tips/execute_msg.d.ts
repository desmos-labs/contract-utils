export type ExecuteMsg = ({
send_tip: {
application: string
handle: string
owner_index?: (Uint64 | null)
}
} | {
claim_tips: {

}
} | {
update_admin: {
new_admin: string
}
} | {
update_max_pending_tips: {
value: number
}
} | {
update_max_sent_pending_tips: {
value: number
}
} | {
remove_pending_tip: {
application: string
handle: string
}
})
/**
 * A thin wrapper around u64 that is using strings for JSON encoding/decoding, such that the full u64 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 * 
 * # Examples
 * 
 * Use `from` to create instances of this and `u64` to get the value out:
 * 
 * ``` # use cosmwasm_std::Uint64; let a = Uint64::from(42u64); assert_eq!(a.u64(), 42);
 * 
 * let b = Uint64::from(70u32); assert_eq!(b.u64(), 70); ```
 */
export type Uint64 = string
