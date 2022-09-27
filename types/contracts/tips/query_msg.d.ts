import { Uint64 } from "./shared-types";

export type QueryMsg = ({
config: {
[k: string]: unknown
}
} | {
user_received_tips: {
user: string
[k: string]: unknown
}
} | {
user_sent_tips: {
user: string
[k: string]: unknown
}
} | {
post_received_tips: {
post_id: Uint64
[k: string]: unknown
}
})
