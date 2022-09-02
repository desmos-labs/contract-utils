export interface NftInfoResponse {
/**
 * You can add any custom metadata here when you extend cw721-base
 */
extension?: (Empty | null)
/**
 * Universal resource identifier for this NFT Should point to a JSON file that conforms to the ERC721 Metadata JSON Schema
 */
token_uri?: (string | null)
[k: string]: unknown
}
/**
 * An empty struct that serves as a placeholder in different places, such as contracts that don't set a custom message.
 * 
 * It is designed to be expressable in correct JSON and JSON Schema but contains no meaningful data. Previously we used enums without cases, but those cannot represented as valid JSON Schema (https://github.com/CosmWasm/cosmwasm/issues/451)
 */
export interface Empty {
[k: string]: unknown
}
