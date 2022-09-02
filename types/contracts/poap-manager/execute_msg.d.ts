export type ExecuteMsg = ({
claim: {
[k: string]: unknown
}
} | {
mint_to: {
recipient: string
[k: string]: unknown
}
} | {
update_admin: {
new_admin: string
[k: string]: unknown
}
})
