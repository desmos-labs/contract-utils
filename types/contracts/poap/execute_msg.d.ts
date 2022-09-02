export type ExecuteMsg = ({
enable_mint: {
[k: string]: unknown
}
} | {
disable_mint: {
[k: string]: unknown
}
} | {
mint: {
[k: string]: unknown
}
} | {
mint_to: {
recipient: string
[k: string]: unknown
}
} | {
update_event_info: {
end_time: Timestamp
start_time: Timestamp
[k: string]: unknown
}
} | {
update_admin: {
new_admin: string
[k: string]: unknown
}
} | {
update_minter: {
new_minter: string
[k: string]: unknown
}
})
/**
 * A point in time in nanosecond precision.
 * 
 * This type can represent times from 1970-01-01T00:00:00Z to 2554-07-21T23:34:33Z.
 * 
 * ## Examples
 * 
 * ``` # use cosmwasm_std::Timestamp; let ts = Timestamp::from_nanos(1_000_000_202); assert_eq!(ts.nanos(), 1_000_000_202); assert_eq!(ts.seconds(), 1); assert_eq!(ts.subsec_nanos(), 202);
 * 
 * let ts = ts.plus_seconds(2); assert_eq!(ts.nanos(), 3_000_000_202); assert_eq!(ts.seconds(), 3); assert_eq!(ts.subsec_nanos(), 202); ```
 */
export type Timestamp = Uint64
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
