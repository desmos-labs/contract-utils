import { DesmosClient } from "@desmoslabs/desmjs";
import { Command } from "commander";
import { AccountData } from "@cosmjs/amino";
import { InstantiateMsg, QueryMsgFor_Empty, ExecuteMsg, Expiration } from "@desmoslabs/contract-types/contracts/cw721-base";
import { parseBool, parseCWTimestamp } from "./cli-parsing-utils";

export function createCw721Program(program: Command, client: DesmosClient, account: AccountData) {
    program.command("init")
        .description("Initialize a new instance of a cw721 base contract")
        .requiredOption("--code-id <code-id>", "Id of the contract to initialize", parseInt)
        .requiredOption("--name <name>", "Name of the NFT contract")
        .requiredOption("--symbol <symbol>", "Symbol of the NFT contract")
        .option("--minter <minter>", "Bech32 address of who will have the minting rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing contract with code ${options.codeId}`);
            let instantiateMsg: InstantiateMsg = {
                name: options.name,
                symbol: options.symbol,
                minter: options.minter,
            };
            const initResult = await client.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        })

    buildExecuteCommands(program, client, account);
    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");
    buildQueryCommands(queryCommand, client);
}

function buildExecuteCommands(program: Command, client: DesmosClient, account: AccountData) {
    program
        .command("transfer")
        .description("Move a token to another account without triggering actions")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--recipient <recipient>", "Address who recieved the token")
        .requiredOption("--token-id <token-id>", "Id of the token")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                transfer_nft: {
                    recipient: options.recipient,
                    token_id: options.tokenId,
                },
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program
        .command("send")
        .description("transfer a token to a contract and trigger an action")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--recipient <recipient>", "Contract address who recieved the token on the receiving contract")
        .requiredOption("--token-id <token-id>", "Id of the token")
        .option("--msg <msg>", "Base64 encoded action message of the recipient contract would be executed")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                send_nft: {
                    contract: options.recipient,
                    token_id: options.tokenId,
                    msg: options.msg,
                },
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program
        .command("approve")
        .description("Allows operator to transfer/send the token from the owner's account before expiration time/height, no expiration time/height if expiration options is unset")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--spender <spender>", "Address who will be given the access to the token")
        .requiredOption("--token-id <token-id>", "Id of the token")
        .option("--expiration-time <expiration-time>", "Timestamp to expire as RFC3339 encoded date example (2022-12-31T14:00:00)", parseCWTimestamp)
        .option("--expiration-height <expiration-height>", "Height to expire", parseInt)
        .action(async (options) => {
            let expiration: Expiration = { never: {} };
            if (options.expirationTime !== undefined) {
                expiration = { at_time: options.expirationTime }
            } else if (options.expirationHeight !== undefined) {
                expiration = { at_height: options.expirationHeight }
            }
            const response = await client.execute(account.address, options.contract, {
                approve: {
                    spender: options.spender,
                    token_id: options.tokenId,
                    expires: expiration,
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program
        .command("revoke")
        .description("Remove previously granted Approval")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--spender <spender>", "Address who will be canceled the access of the token")
        .requiredOption("--token-id <token-id>", "Id of the token")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                revoke: {
                    spender: options.spender,
                    token_id: options.tokenId,
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program
        .command("approve-all")
        .description("Allows operator to transfer/send any token from the owner's account before expiration time/height, no expiration time/height if expiration options is unset")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--operator <operator>", "Address who will be given the access of all tokens")
        .option("--expiration-time <expiration-time>", "Timestamp to expire as RFC3339 encoded date example (2022-12-31T14:00:00)", parseCWTimestamp)
        .option("--expiration-height <expiration-height>", "Height to expire", parseInt)
        .action(async (options) => {
            let expiration: Expiration = { never: {} };
            if (options.expirationTime !== undefined) {
                expiration = { at_time: options.expirationTime }
            } else if (options.expirationHeight !== undefined) {
                expiration = { at_height: options.expirationHeight }
            }
            const response = await client.execute(account.address, options.contract, {
                approve_all: options.operator,
                expires: expiration,
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program
        .command("revoke-all")
        .description("Remove previously granted as operation permission by ApproveAll")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--operator <operator>", "Address who will be canceled the access of all tokens")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                revoke_all: {
                    operator: options.operator,
                },
            } as ExecuteMsg, "auto");
            console.log(response);
        });


    program
        .command("burn")
        .description("Burn an NFT the sender has access to")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                burn: {
                    token_id: options.tokenId,
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

}

function buildQueryCommands(program: Command, client: DesmosClient) {
    program
        .command("owner-of")
        .description("Queries the owner of the given token, error if token does not exist")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .action(async (options) => {
            console.log(`Querying owner of token id ${options.tokenId}`);
            const owner = await client.queryContractSmart(options.contract, {
                owner_of: { token_id: options.tokenId, include_expired: options.includeExpired },
            } as QueryMsgFor_Empty);
            console.log("owner info", owner)
        });

    program
        .command("approval")
        .description("Queries the operator that can access all of the owner's tokens")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .requiredOption("--spender <spender>", "Address who has the token access")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .action(async (options) => {
            console.log(`Querying approval of token id ${options.tokenId} approved to the spender ${options.spender}`);
            const approval = await client.queryContractSmart(options.contract, {
                approval: { token_id: options.tokenId, spender: options.spender, include_expired: options.includeExpired },
            } as QueryMsgFor_Empty);
            console.log("approval", approval);
        });

    program
        .command("approvals")
        .description("Queries all the approvals of the given token")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .action(async (options) => {
            console.log(`Querying all approvals info of token id ${options.tokenId}`);
            const approvals = await client.queryContractSmart(options.contract, {
                approvals: { token_id: options.tokenId, include_expired: options.includeExpired },
            } as QueryMsgFor_Empty);
            console.log("approvals", approvals);
        });

    program
        .command("all-operators")
        .description("Queries all operators that can access all the owner's tokens")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--owner <owner>", "Address of the owner")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .option("--start-after <start-after>", "Position in address where operators start after")
        .option("--limit <limit>", "Limitation to list the number of operators", parseInt, 0)
        .action(async (options) => {
            console.log(`Querying operators of the owner ${options.owner}`);
            const operators = await client.queryContractSmart(options.contract, {
                all_operators: {
                    owner: options.owner,
                    include_expired: options.includeExpired,
                    start_after: options.startAfter,
                    limit: options.limit,
                },
            } as QueryMsgFor_Empty);
            console.log("operators", operators)
        });

    program
        .command("num-tokens")
        .description("Queries total number of tokens issued")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying operators of the number of tokens`);
            const num = await client.queryContractSmart(options.contract, {
                num_tokens: {},
            } as QueryMsgFor_Empty);
            console.log("num", num);
        });

    program
        .command("contract-info")
        .description("Queries the top-level metadata about the contract")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying contract info of ${options.contract}`)
            const config = await client.queryContractSmart(options.contract, {
                contract_info: {},
            } as QueryMsgFor_Empty);
            console.log("Contract info", config);
        });

    program
        .command("nft-info")
        .description("Queries the metadata about the given token")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .action(async (options) => {
            console.log(`Querying nft info of token id ${options.tokenId}`);
            const info = await client.queryContractSmart(options.contract, {
                nft_info: { token_id: options.tokenId },
            } as QueryMsgFor_Empty);
            console.log("NFT info", info)
        });

    program
        .command("all-nft-info")
        .description("Queries the result including both nft info and ownerof info")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .action(async (options) => {
            console.log(`Querying all nft info of token id ${options.tokenId}`);
            const info = await client.queryContractSmart(options.contract, {
                all_nft_info: { token_id: options.tokenId, include_expired: options.includeExpired },
            } as QueryMsgFor_Empty);
            console.log("All NFT info", info)
        });

    program
        .command("tokens")
        .description("Queries all the tokens owned by the given address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--owner <owner>", "Address of the owner to query")
        .option("--start-after <start-after>", "Position in token id where tokens start after")
        .option("--limit <limit>", "Limitation to list the number of tokens", parseInt, 0)
        .action(async (options) => {
            console.log(`Queries all tokens owned by ${options.owner}`);
            const tokens = await client.queryContractSmart(options.contract, {
                tokens: { owner: options.owner, start_after: options.startAfter, limit: options.limit },
            } as QueryMsgFor_Empty);
            console.log("tokens", tokens);
        });

    program
        .command("all-tokens")
        .description("Queries all tokens ids")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .option("--start-after <start-after>", "Position in token id where tokens start after")
        .option("--limit <limit>", "Limitation to list the number of tokens")
        .action(async (options) => {
            console.log(`Queries all tokens`);
            const tokens = await client.queryContractSmart(options.contract, {
                all_tokens: { start_after: options.startAfter, limit: options.limit },
            } as QueryMsgFor_Empty);
            console.log("tokens", tokens);
        });

    program
        .command("minter")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .description("Queries the minter")
        .action(async (options) => {
            console.log(`Queries the minter`);
            const minter = await client.queryContractSmart(options.contract, {
                minter: {},
            } as QueryMsgFor_Empty);
            console.log("minter", minter);
        });

}