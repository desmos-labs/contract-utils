import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program, Command } from "commander";
import * as Config from "./config"
import { AccountData } from "@cosmjs/amino";
import { InstantiateMsg, QueryMsgFor_Empty } from "@desmoslabs/contract-types/contracts/cw721-base";
import { parseBool } from "./cli-parsing-utils";

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

    program.name("Cw721 base contract utils")
        .description("Utility script to interact with the cw721 base contract");

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


    buildQueryCommand(program, client)

    console.log(`Executing as ${account.address}`);
    program.parse();
}

function buildExecuteCommand(program, client) {
    const command = program.command("exectue")
        .description("Subcommand to exectue the contract");
}

function buildQueryCommand(program: Command, client: DesmosClient) {
    const command = program.command("query")
        .description("Subcommand to query the contract");

    command
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

    command
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

    command
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

    command
        .command("all-operators")
        .description("Queries all operators that can access all the owner's tokens")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--owner <owner>", "Address of the owner")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .option("--start-after <start-after>", "Position in address where operators start after", "")
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

    command
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

    command
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

    command
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

    command
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

    command
        .command("tokens")
        .description("Queries all the tokens owned by the given address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--owner <owner>", "Address of the owner to query")
        .option("--start-after <start-after>", "")
        .option("--limit <limit>", "Limitation to list the number of tokens", parseInt, 0)
        .action(async (options) => {
            console.log(`Queries all tokens owned by ${options.owner}`);
            const tokens = await client.queryContractSmart(options.contract, {
                all_tokens: { owner: options.owner, start_after: options.start_after, limit: options.limit },
            } as QueryMsgFor_Empty);
            console.log("tokens", tokens);
        });

    command
        .command("all-tokens")
        .description("Queries all tokens ids")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .option("--start-after <start-after>", "")
        .option("--limit <limit>", "Limitation to list the number of tokens")
        .action(async (options) => {
            console.log(`Queries all tokens`);
            const tokens = await client.queryContractSmart(options.contract, {
                all_tokens: { start_after: options.start_after, limit: options.limit },
            } as QueryMsgFor_Empty);
            console.log("tokens", tokens);
        });

    command
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

main();