import { Addr, Timestamp } from "./shared-types";

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

export interface AllNftInfoResponseFor_Metadata {
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
export interface Metadata {
claimer: Addr
[k: string]: unknown
}
