import { Coin, Uint64 } from "./shared-types";

export type ExecuteMsg = ({
mint: {
post_id: Uint64
rarity_level: number
remarkables_uri: string
[k: string]: unknown
}
} | {
update_rarity_mint_fees: {
new_fees: Coin[]
rarity_level: number
[k: string]: unknown
}
} | {
update_admin: {
new_admin: string
[k: string]: unknown
}
})
