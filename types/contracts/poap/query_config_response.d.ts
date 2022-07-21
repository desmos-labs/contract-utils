import { Addr } from "./shared-types";

/**
 * Response to [`QueryMsg::Config`].
 */
export interface QueryConfigResponse {
/**
 * Address of the contract administrator.
 */
admin: Addr
/**
 * Address of the cw721 contract that this contract is using to mint the poaps.
 */
cw721_contract: Addr
/**
 * Id of the cw721 contract that this contract has initialized.
 */
cw721_contract_code: number
/**
 * Tells if the users can execute the [`ExecuteMsg::Mint`].
 */
mint_enabled: boolean
/**
 * Address of the entity that is allowed to use [`ExecuteMsg::MintTo`].
 */
minter: Addr
/**
 * The maximus number of poap that an user can request.
 */
per_address_limit: number
[k: string]: unknown
}
