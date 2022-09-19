import { Uint64 } from "./shared-types";

/**
 * A human readable address.
 * 
 * In Cosmos, this is typically bech32 encoded. But for multi-chain smart contracts no assumptions should be made other than being UTF-8 encoded and of reasonable length.
 * 
 * This type represents a validated address. It can be created in the following ways 1. Use `Addr::unchecked(input)` 2. Use `let checked: Addr = deps.api.addr_validate(input)?` 3. Use `let checked: Addr = deps.api.addr_humanize(canonical_addr)?` 4. Deserialize from JSON. This must only be done from JSON that was validated before such as a contract's state. `Addr` must not be used in messages sent by the user because this would result in unvalidated instances.
 * 
 * This type is immutable. If you really need to mutate it (Really? Are you sure?), create a mutable copy using `let mut mutable = Addr::to_string()` and operate on that `String` instance.
 */
export type Addr = string

/**
 * Response to [`QueryMsg::Config`].
 */
export interface QueryConfigResponse {
/**
 * Address of the contract administrator.
 */
admin: Addr
/**
 * Address of the cw721 contract that this contract is using to mint.
 */
cw721_address: Addr
/**
 * Id of the cw721 contract that this contract has initialized.
 */
cw721_code_id: Uint64
/**
 * Id of the subspace to operate.
 */
subspace_id: Uint64
[k: string]: unknown
}
