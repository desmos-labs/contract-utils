import { Metadata } from "./shared-types";

/**
 * Expiration represents a point in time when some event happens. It can compare with a BlockInfo and will return is_expired() == true once the condition is hit (and for every block in the future)
 */
export type Expiration = ({
at_height: number
} | {
at_time: Timestamp
} | {
never: {
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

export interface AllNftInfoResponse {
/**
 * Who can transfer the token
 */
access: OwnerOfResponse
/**
 * Data on the token itself,
 */
info: NftInfoResponseFor_Metadata
[k: string]: unknown
}
export interface OwnerOfResponse {
/**
 * If set this address is approved to transfer/send the token as well
 */
approvals: Approval[]
/**
 * Owner of the token
 */
owner: string
[k: string]: unknown
}
export interface Approval {
/**
 * When the Approval expires (maybe Expiration::never)
 */
expires: Expiration
/**
 * Account that can transfer/send the token
 */
spender: string
[k: string]: unknown
}
export interface NftInfoResponseFor_Metadata {
/**
 * You can add any custom metadata here when you extend cw721-base
 */
extension: Metadata
/**
 * Universal resource identifier for this NFT Should point to a JSON file that conforms to the ERC721 Metadata JSON Schema
 */
token_uri?: (string | null)
[k: string]: unknown
}
