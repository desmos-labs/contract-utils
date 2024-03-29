import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program, Command } from "commander";
import * as Config from "./config";
import { RemarkablesClient } from "@desmoslabs/contract-types/contracts/Remarkables.client";
import { InstantiateMsg, Rarity } from "@desmoslabs/contract-types/contracts/Remarkables.types";
import { AccountData } from "@cosmjs/amino";
import { parseBool, parseCoinList } from "./cli-parsing-utils";

/**
 * Parse a comma separated list of mint fees.
 * @param raw - The string to be parsed as list of mint fees.
 */
function parseMintFeesList(raw: string): { denom: string, amount: string }[][] {
    return raw.split("],").map(value => parseCoinList(value.replace("[", "").replace("]", "")));
}

/**
 * Parse a comma separated list of engagement thresholds.
 * @param raw - The string to be parsed as list of engagement threshold.
 */
function parseEngagementThresholds(raw: string): number[] {
    return raw.split(",").map(value => parseInt(value));
}

/**
 * Build rarities from engagement thresholds and mint fees list.
 * @param engagementThresholds - The engagement thresholds shown as array of number.
 * @param mintFeesList - The mint fees list shown as array of coin list.
 */
function buildRarities(engagementThresholds: number[], mintFeesList: { denom: string, amount: string }[][]): Rarity[] {
    if (engagementThresholds.length != mintFeesList.length) {
        throw new Error("egagement thresholds size not equal to mint fees list size");
    }
    const rarities: Rarity[] = [];
    for (let i = 0; i < engagementThresholds.length; i++) {
        rarities.push({ engagement_threshold: engagementThresholds[i], mint_fees: mintFeesList[i] });
    }
    if (rarities.length == 0) {
        throw new Error("empty rarities")
    }
    return rarities;
}

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const desmosClient = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
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
        .requiredOption("--mint-fees-list <mint-fees-list>", "Mint fees list of rarities to be initialized. ex: [1000stkae,1000udsm],[1000udsm]", parseMintFeesList)
        .option("--admin <admin>", "Bech32 address of who will have the contract admin rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing contract with code ${options.codeId}`);
            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                cw721_code_id: options.cw721CodeId.toString(),
                cw721_instantiate_msg: {
                    name: options.name,
                    // Just a string since this will be replaced from the contract.
                    minter: "contract_address",
                    symbol: options.symbol
                },
                subspace_id: options.subspaceId.toString(),
                rarities: buildRarities(options.engagementThresholds, options.mintFeesList),
            };
            const initResult = await desmosClient.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        });
    buildExecuteCommands(program, desmosClient, account);
    buildQueryCommands(program, desmosClient, account);
    program.parse();
}
function buildExecuteCommands(program: Command, desmosClient: DesmosClient, account: AccountData) {
    program
        .command("mint")
        .description("Mint a remarkables for the given post")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--post-id <post-id>", "id of the post which is the target to mint", parseInt)
        .requiredOption("--remarkables-uri <remarkables-uri>", "IPFS uri where the remarkable's metadata are stored")
        .requiredOption("--rarity-level <rarity-level>", "level which remarkables would be minted", parseInt)
        .requiredOption("--mint-fees <mint-fees>", "fees to mint the remarkables. ex: 1000stkae,1000udsm", parseCoinList)
        .action(async (options) => {
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const response = await client.mint({ postId: options.postId.toString(), remarkablesUri: options.remarkablesUri, rarityLevel: options.rarityLevel }, "auto", "", options.mintFees);
            console.log(response);
        });
    program
        .command("update-rarity-mint-fee")
        .description("Update the mint fee of the given rarity level")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--rarity-level <rarity-level>", "level which the mint fee would be updated", parseInt)
        .requiredOption("--mint-fees <mint-fees>", "new mint fees that would be set to the rarity level. ex: 1000stkae,1000udsm", parseCoinList)
        .action(async (options) => {
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const response = await client.updateRarityMintFees({ rarityLevel: options.rarityLevel, newFees: options.mintFees });
            console.log(response);
        })
    program
        .command("update-admin")
        .description("Updates who have the admin rights over the contract")
        .argument("<address>", "new admin's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (newAdmin, options) => {
            console.log(`Setting new admin address to ${newAdmin}`);
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const response = await client.updateAdmin({ newAdmin });
            console.log(response);
        });
    program.command("claim-fees")
        .description("claim the fees collected from the contract")
        .argument("<receiver>", "bech32 address to which they will be sent")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            console.log(`Claiming contract fee and send to ${receiver}`);
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const response = await client.claimFees({ receiver });
            console.log(response);
        });
}
function buildQueryCommands(program: Command, desmosClient: DesmosClient, account: AccountData) {
    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");
    queryCommand
        .command("config")
        .description("Queries the contract config")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying config of ${options.contract}`);
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const config = await client.config();
            console.log("Config", config);
        });
    queryCommand
        .command("rarities")
        .description("Queries the contract rarities list")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying rarities of ${options.contract}`);
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const rarities = await client.rarities();
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
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const info = await client.allNftInfo({ tokenId: options.tokenId, includeExpired: options.includeExpired });
            console.log("All NFT info", info)
        });
    queryCommand
        .command("tokens")
        .description("Queries all the tokens owned by the given address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--owner <owner>", "Address of the owner to query")
        .option("--start-after <start-after>", "Position in address where operators start after")
        .option("--limit <limit>", "Limitation to list the number of tokens", parseInt)
        .action(async (options) => {
            console.log(`Queries all tokens owned by ${options.owner}`);
            const client = new RemarkablesClient(desmosClient, account.address, options.contract);
            const tokens = await client.tokens({ owner: options.owner, startAfter: options.startAfter, limit: options.limit });
            console.log("tokens", tokens);
        });
}

main();