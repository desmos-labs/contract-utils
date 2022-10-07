import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program, Command } from "commander";
import * as Config from "./config"
import { ExecuteMsg, InstantiateMsg, QueryMsg, Rarity } from "@desmoslabs/contract-types/contracts/remarkables";
import { AccountData } from "@cosmjs/amino";
import { parseBool, parseCoinList } from "./cli-parsing-utils";

/**
 * Parse a comma separated list of mint fees.
 * @param raw - The string to be parsed as list of mint fees.
 */
function parseMintFeesList(raw: string): { denom: string, amount: string }[][] {
    return raw.split(",").map(parseCoinList);
}

/**
 * Parse a comma separated list of engagement thresholds.
 * @param raw - The string to be parsed as list of engagement threshold.
 */
function parseEngagementThresholds(raw: string): number[] {
    return raw.split(",").map(parseInt);
}

/**
 * Build rarities from engagement thresholds and mint fees list.
 * @param engagementThresholds - The engagement thresholds shown as array of number.
 * @param mintFeesList - The mint fees list shown as array of coin list.
 */
function buildRarities(engagementThresholds: number[], mintFeesList: { denom: string, amount: string }[][]) : Rarity[]{
    if (engagementThresholds.length != mintFeesList.length) {
        throw new Error("egagement thresholds size not equal to mint fees list size");
    }
    const rarities: Rarity[] = [];
    for(let i = 0; i <  engagementThresholds.length; i++) {
        rarities.push({engagement_threshold: engagementThresholds[i], mint_fees: mintFeesList[i]});
    }
    if (rarities.length == 0) {
        throw new Error("empty rarities")
    }
    return rarities;
}

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;
    program.name("Remarkables contract utils")
        .description("Utility script to interact with the remarkables contract");
    program.command("init")
        .description("Initialize a new instance of a poap contract")
        .requiredOption("--code-id <code-id>", "Id of the contract to initialize", parseInt)
        .requiredOption("--cw721-code-id <cw721-code-id>", "Id of the cw721 contract that will be initialized from the remarkables contract", parseInt)
        .requiredOption("--name <name>", "Remarkables name")
        .requiredOption("--symbol <symbol>", "Remarkables symbol")
        .requiredOption("--subspace-id <subspace-id>", "Id of the subspace where remarkables contract operates", parseInt)
        .requiredOption("--engagement-thresholds <engagement-thresholds>", "Engagement thresholds of rarities to be initialized. ex: 50,100", parseEngagementThresholds)
        .requiredOption("--mint-fees-list <mint-fees-list>", "Mint fees list of rarities to be initialized. ex: [[1000stkae,1000udsm],[1000udsm]]", parseMintFeesList)
        .option("--admin <admin>", "Bech32 address of who will have the contract admin rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing contract with code ${options.codeId}`);
            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                cw721_code_id: options.cw721CodeId.toString(),
                cw721_instantiate_msg: {
                    name: options.name,
                    minter: options.minter,
                    symbol: options.symbol
                },
                subspace_id: options.subspace_id.toString(),
                rarities: buildRarities(options.engagementThresholds, options.mintFeesList),
            };
            const initResult = await client.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        });
    buildExecuteCommands(program, client, account);
    buildQueryCommands(program, client);
    program.parse();
}
function buildExecuteCommands(program: Command, client: DesmosClient, account: AccountData) {
    program
        .command("mint")
        .description("Mint a remarkables for the given post")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--post-id <post-id>", "id of the post which is the target to mint")
        .requiredOption("--rarity-level <rarity-level>", "level which remarkables would be minted", parseInt)
        .requiredOption("--mint-fees <mint-fees>", "fees to mint the remarkables. ex: 1000stkae,1000udsm", parseCoinList)
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                mint: { post_id: options.post_id, rarity_level: options.rarity_level }
            } as ExecuteMsg, "auto", "", options.mint_fees);
            console.log(response);
        });
    program
        .command("update-rarity-mint-fee")
        .description("Update the mint fee of the given rarity level")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--rarity-level <rarity-level>", "level which the mint fee would be updated", parseInt)
        .requiredOption("--mint-fees <mint-fees>", "new mint fees that would be set to the rarity level. ex: 1000stkae,1000udsm", parseCoinList)
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {
                update_rarity_mint_fees: { rarity_level: options.rarity_level, new_fees: options.mint_fees }
            } as ExecuteMsg, "auto");
            console.log(response);
        })
    program
        .command("update-admin")
        .description("Updates who have the admin rights over the contract")
        .argument("<address>", "new admin's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (new_admin, options) => {
            console.log(`Setting new admin address to ${new_admin}`);
            const response = await client.execute(account.address, options.contract, {
                update_admin: {
                    new_admin: new_admin
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });
}
function buildQueryCommands(program: Command, client: DesmosClient) {
    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");
    queryCommand
        .command("config")
        .description("Queries the contract config")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying config of ${options.contract}`)
            const config = await client.queryContractSmart(options.contract, { config: {} } as QueryMsg);
            console.log("Config", config);
        });
    queryCommand
        .command("rarities")
        .description("Queries the contract rarities list")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying rarities of ${options.contract}`)
            const rarities = await client.queryContractSmart(options.contract, { rarities: {} } as QueryMsg);
            console.log("Rarities", rarities);
        });
    queryCommand
        .command("all-nft-info")
        .description("Queries the result including both nft info and ownerof info")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .action(async (options) => {
            console.log(`Querying all nft info of token id ${options.tokenId}`);
            const info = await client.queryContractSmart(options.contract, {
                all_nft_info: { token_id: options.tokenId, include_expired: options.includeExpired },
            } as QueryMsg);
            console.log("All NFT info", info)
        });
    queryCommand
        .command("tokens")
        .description("Queries all the tokens owned by the given address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--owner <owner>", "Address of the owner to query")
        .option("--start-after <start-after>", "")
        .option("--limit <limit>", "Limitation to list the number of tokens", parseInt, 0)
        .action(async (options) => {
            console.log(`Queries all tokens owned by ${options.owner}`);
            const tokens = await client.queryContractSmart(options.contract, {
                tokens: { owner: options.owner, start_after: options.startAfter, limit: options.limit },
            } as QueryMsg);
            console.log("tokens", tokens);
        });
}

main();