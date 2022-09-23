import { Empty, OwnerOfResponse } from "./shared-types";

export interface AllNftInfoResponse {
/**
 * Who can transfer the token
 */
access: OwnerOfResponse
/**
 * Data on the token itself,
 */
info: NftInfoResponseFor_Nullable_Empty
}

export interface NftInfoResponseFor_Nullable_Empty {
/**
 * You can add any custom metadata here when you extend cw721-base
 */
extension?: (Empty | null)
/**
 * Universal resource identifier for this NFT Should point to a JSON file that conforms to the ERC721 Metadata JSON Schema
 */
token_uri?: (string | null)
}
