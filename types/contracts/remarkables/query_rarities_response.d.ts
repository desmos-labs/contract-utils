import { Rarity } from "./shared-types";

/**
 * Response to [`QueryMsg::Rarities`].
 */
export interface QueryRaritiesResponse {
/**
 * List of rarities state in this contract.
 */
rarities: Rarity[]
[k: string]: unknown
}
