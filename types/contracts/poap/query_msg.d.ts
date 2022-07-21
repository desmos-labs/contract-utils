export type QueryMsg = ({
config: {
[k: string]: unknown
}
} | {
event_info: {
[k: string]: unknown
}
})
