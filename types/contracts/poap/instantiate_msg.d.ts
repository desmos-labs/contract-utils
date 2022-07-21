import { EventInfo_1 } from "./shared-types";

export interface InstantiateMsg {
/**
 * Address of who will have the right to administer the contract.
 */
admin: string
/**
 * Id of the CW721 contract to initialize together with this contract.
 */
cw721_code_id: number
/**
 * Initialization message that will be sent to the CW721 contract.
 */
cw721_initiate_msg: InstantiateMsg1
/**
 * Information about the event.
 */
event_info: EventInfo_1
/**
 * Address of who can call the [`ExecuteMsg::MintTo`] other then the admin.
 */
minter: string
[k: string]: unknown
}
export interface InstantiateMsg1 {
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
