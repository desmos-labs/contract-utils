export interface InstantiateMsg {
/**
 * The minter is the only one who can create new NFTs. This is designed for a base NFT that is controlled by an external program or contract. You will likely replace this with custom logic in custom NFTs
 */
minter: string
/**
 * Name of the NFT contract
 */
name: string
/**
 * Symbol of the NFT contract
 */
symbol: string
[k: string]: unknown
}
