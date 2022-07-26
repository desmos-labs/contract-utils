import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program } from "commander";
import * as Config from "./config"
import { PoapClient } from "@desmoslabs/contract-types/contracts/Poap.client";
import { InstantiateMsg } from "@desmoslabs/contract-types/contracts/Poap.types";
import { AccountData } from "@cosmjs/amino";
import { parseBool, parseCWTimestamp, parseIpfsUri } from "./cli-parsing-utils";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const desmosClient = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

    program.name("Poap contract utils")
        .description("Utility script to interact with the poap contract");

    program.command("init")
        .description("Initialize a new instance of a poap contract")
        .requiredOption("--code-id <code-id>", "Id of the contract to initialize", parseInt)
        .requiredOption("--cw721-code-id <cw721-code-id>", "Id of the cw721 contract that will be initialized from the poap contract", parseInt)
        .requiredOption("--name <name>", "Poap name")
        .requiredOption("--symbol <symbol>", "Poap symbol")
        .requiredOption("--start <start>", "Datetime when the event will start in RFC3339 format (2022-12-31:10:00:00)", parseCWTimestamp)
        .requiredOption("--end <end>", "Date when the event will end in RFC3339 format (2022-12-31:10:00:00)", parseCWTimestamp)
        .requiredOption("--address-limit <address_limit>", "Max number of poap that an user can receive", parseInt)
        .requiredOption("--poap-uri <poap_uri>", "IPFS uri where the event's metadata are stored", parseIpfsUri)
        .option("--creator <creator>", "Bech32 address of who is creating the event", account!.address)
        .option("--minter <minter>", "Bech32 address of who will have the minting rights", account!.address)
        .option("--admin <admin>", "Bech32 address of who will have the contract admin rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing contract with code ${options.codeId}`);
            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                minter: options.minter,
                cw721_code_id: options.cw721CodeId.toString(),
                event_info: {
                    creator: options.creator,
                    poap_uri: options.poapUri.toString(),
                    start_time: options.start,
                    end_time: options.end,
                    per_address_limit: options.addressLimit
                },
                cw721_instantiate_msg: {
                    name: options.name,
                    minter: options.minter,
                    symbol: options.symbol
                }
            }

            const initResult = await desmosClient.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        })

    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");

    queryCommand
        .command("state")
        .description("Queries the contract state")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying state of ${options.contract}`)
            // Query config
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const config = await client.config();
            console.log("Config", config);

            // Query event info
            const eventInfo = await client.eventInfo();
            console.log("EventInfo", eventInfo);
        });

    queryCommand
        .command("minted-amount")
        .description("Queries the amount of contracts minted from an user")
        .requiredOption("--user <user>", "bech32 encoded address of the user of interest")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying minted amount for ${options.user}`)
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const mintedAmount = await client.mintedAmount({ user: options.user });
            console.log("mintedAmount", mintedAmount);
        });

    queryCommand
        .command("all-nft-info")
        .description("Queries the result including both nft info and ownerof info")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token to query")
        .option("--include-expired <include-expired>", "Unset or false will filter out expired approvals", parseBool, false)
        .action(async (options) => {
            console.log(`Querying all nft info of token id ${options.tokenId}`);
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const info = await client.allNftInfo({ tokenId: options.tokenId, includeExpired: options.includeExpired });
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
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const tokens = await client.tokens({ owner: options.owner, startAfter: options.startAfter, limit: options.limit });
            console.log("tokens", tokens);
        });

    program.command("mint-enabled")
        .description("Enable/disable the possibility to mint a poap from the users")
        .argument("<boolean>", "true to allow mint from the users, false to disable", parseBool)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (enable, options) => {
            const client = new PoapClient(desmosClient, account.address, options.contract);
            let response: ExecuteResult;
            if (enable) {
                console.log(`Enabling mint for contract ${options.contract}`);
                response = await client.enableMint();
            } else {
                console.log(`Disabling mint for contract ${options.contract}`);
                response = await client.disableMint();
            }
            console.log(response);
        });

    program.command("mint")
        .description("Mint a poap for the current user")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const response = await client.mint();
            console.log(response);
        });


    program.command("mint-to")
        .description("Mint a poap for another user")
        .argument("<address>", "bech32 address of the user that will receive the poap")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (address, options) => {
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const response = await client.mintTo({
                recipient: address
            });
            console.log(response);
        });

    program.command("update-info")
        .description("Modify the event details")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .option("--start <start>", "New event start time as RFC3339 encoded date example (2022-12-31T14:00:00)", parseCWTimestamp)
        .option("--end <end>", "New event end time as RFC3339 encoded date example (2022-12-31T14:00:00)", parseCWTimestamp)
        .action(async (options) => {
            if (options.start === undefined && options.end === undefined) {
                console.log("Nothing to update");
                return;
            }
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const currentEventInfo = await client.eventInfo();
            const response = await client.updateEventInfo({
                startTime: options.start ?? currentEventInfo.start_time,
                endTime: options.end ?? currentEventInfo.end_time
            });
            console.log(response);
        })

    program.command("update-admin")
        .description("Updates who have the admin rights over the contract")
        .argument("<address>", "new admin's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (newAdmin, options) => {
            console.log(`Setting new admin address to ${newAdmin}`);
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const response = await client.updateAdmin({
                newAdmin
            });
            console.log(response);
        });

    program.command("update-minter")
        .description("Updates who have the minting rights over the contract")
        .argument("<address>", "new minter's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (newMinter, options) => {
            console.log(`Setting new minter address to ${newMinter}`);
            const client = new PoapClient(desmosClient, account.address, options.contract);
            const response = await client.updateMinter({
                newMinter: newMinter
            });
            console.log(response);
        });

    console.log(`Executing as ${account.address}`);
    program.parse();
}


main();