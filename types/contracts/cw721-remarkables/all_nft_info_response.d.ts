import { Expiration, Metadata } from "./shared-types";

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
