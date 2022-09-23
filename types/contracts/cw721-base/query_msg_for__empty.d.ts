import { Empty } from "./shared-types";

export type QueryMsgFor_Empty = ({
owner_of: {
/**
 * unset or false will filter out expired approvals, you must set to true to see them
 */
include_expired?: (boolean | null)
token_id: string
}
} | {
approval: {
include_expired?: (boolean | null)
spender: string
token_id: string
}
} | {
approvals: {
include_expired?: (boolean | null)
token_id: string
}
} | {
all_operators: {
/**
 * unset or false will filter out expired items, you must set to true to see them
 */
include_expired?: (boolean | null)
limit?: (number | null)
owner: string
start_after?: (string | null)
}
} | {
num_tokens: {

}
} | {
contract_info: {

}
} | {
nft_info: {
token_id: string
}
} | {
all_nft_info: {
/**
 * unset or false will filter out expired approvals, you must set to true to see them
 */
include_expired?: (boolean | null)
token_id: string
}
} | {
tokens: {
limit?: (number | null)
owner: string
start_after?: (string | null)
}
} | {
all_tokens: {
limit?: (number | null)
start_after?: (string | null)
}
} | {
minter: {

}
} | {
extension: {
msg: Empty
}
})
