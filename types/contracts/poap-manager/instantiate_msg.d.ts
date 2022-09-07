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

export interface InstantiateMsg {
/**
 * Address of who will have the right to administer the contract.
 */
admin: string
/**
 * Id of the POAP contract to be initialized along with this contract.
 */
poap_code_id: Uint64
/**
 * Initialization message of the POAP contract.
 */
poap_instantiate_msg: InstantiateMsg1
[k: string]: unknown
}
export interface InstantiateMsg1 {
/**
 * Address of who will have the right to administer the contract.
 */
admin: string
/**
 * Id of the CW721 contract to initialize together with this contract.
 */
cw721_code_id: Uint64
/**
 * Initialization message that will be sent to the CW721 contract.
 */
cw721_instantiate_msg: InstantiateMsg2
/**
 * Information about the event.
 */
event_info: EventInfo
/**
 * Address of who can call the [`ExecuteMsg::MintTo`] other then the admin.
 */
minter: string
[k: string]: unknown
}
export interface InstantiateMsg2 {
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
export interface EventInfo {
/**
 * User that created the event.
 */
creator: string
/**
 * Time at which the event ends.
 */
end_time: Timestamp
/**
 * Max amount of poap that a single user can mint.
 */
per_address_limit: number
/**
 * Identifies a valid IPFS URI corresponding to where the assets and metadata of the POAPs are stored.
 */
poap_uri: string
/**
 * Time at which the event begins.
 */
start_time: Timestamp
[k: string]: unknown
}
