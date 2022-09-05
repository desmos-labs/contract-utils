import { Addr } from "./shared-types";

export interface Config {
admin: Addr
cw721_code_id: number
mint_enabled: boolean
minter: Addr
per_address_limit: number
[k: string]: unknown
}
