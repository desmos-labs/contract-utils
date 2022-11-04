export type QueryMsg = ({
user_pending_tips: {
user: string
}
} | {
unclaimed_sent_tips: {
user: string
}
} | {
config: {

}
})
