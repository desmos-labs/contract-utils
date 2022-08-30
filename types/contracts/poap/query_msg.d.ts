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
})
