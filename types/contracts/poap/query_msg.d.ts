export type QueryMsg = ({
config: {
[k: string]: unknown
}
} | {
event_info: {
[k: string]: unknown
}
} | {
minted_amount: {
user: string
[k: string]: unknown
}
} | {
all_nft_info: {
include_expired?: (boolean | null)
token_id: string
[k: string]: unknown
}
} | {
tokens: {
limit?: (number | null)
owner: string
start_after?: (string | null)
[k: string]: unknown
}
})
