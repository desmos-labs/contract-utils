import { Timestamp } from "./shared-types";

export type ExecuteMsg = ({
enable_mint: {
[k: string]: unknown
}
} | {
disable_mint: {
[k: string]: unknown
}
} | {
mint: {
[k: string]: unknown
}
} | {
mint_to: {
recipient: string
[k: string]: unknown
}
} | {
update_event_info: {
end_time: Timestamp
start_time: Timestamp
[k: string]: unknown
}
} | {
update_admin: {
new_admin: string
[k: string]: unknown
}
} | {
update_minter: {
new_minter: string
[k: string]: unknown
}
})
