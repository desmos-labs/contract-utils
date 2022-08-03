import {DesmosClient, OfflineSignerAdapter, SigningMode} from "@desmoslabs/desmjs";
import {program} from "commander";
import * as Config from "./config"
import {EventInfo, ExecuteMsg, QueryMsg} from "@desmoslabs/contract-types/contracts/poap";
import {AccountData} from "@cosmjs/amino";
import {parseBool, parseCWTimestamp} from "./cli-parsing-utils";

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

    program.name("Poap contract utils")
        .description("Utility script to interact with the poap contract");

    program.command("query")
        .description("Queries the contract state")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Quering state of ${options.contract}`)
            // Query config
            const config = await client.queryContractSmart(options.contract, {config: {}} as QueryMsg);
            console.log("Config", config);

            // Query event info
            const event_info = await client.queryContractSmart(options.contract, {event_info: {}} as QueryMsg);
            console.log("EventInfo", event_info);
        })

    program.command("mint-enabled")
        .description("Enable/disable the possibility to mint a poap from the users")
        .argument("<boolean>", "true to allow mint from the users, false to disable", parseBool)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (enable, options) => {
            let msg: ExecuteMsg;

            if (enable) {
                console.log(`Enabling mint for contract ${options.contract}`);
                msg = {enable_mint: {}}
            } else {
                console.log(`Disabling mint for contract ${options.contract}`);
                msg = {enable_mint: {}}
            }

            const response = await client.execute(account.address, options.contract, msg, "auto");
            console.log(response);
        });

    program.command("mint")
        .description("Mint a poap for the current user")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, { mint: {} } as ExecuteMsg, "auto");
            console.log(response);
        });


    program.command("mint-to")
        .description("Mint a poap for another user")
        .argument("<address>", "bech32 address of the user that will receive the poap")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (address, options) => {
            const response = await client.execute(account.address, options.contract, {
                mint_to: {
                    recipient: address
                }
            } as ExecuteMsg, "auto");
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
            const currentEventInfo: EventInfo = await client.queryContractSmart(options.contract, { event_info: {} } as QueryMsg);
            let msg: ExecuteMsg = {
                update_event_info: {
                    start_time: options.start ?? currentEventInfo.start_time,
                    end_time: options.end ?? currentEventInfo.end_time
                }
            };

            const response = await client.execute(account.address, options.contract, msg, "auto");
            console.log(response);
        })

    program.command("update-admin")
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

    program.command("update-minter")
        .description("Updates who have the minting rights over the contract")
        .argument("<address>", "new minter's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (new_minter, options) => {
            console.log(`Setting new minter address to ${new_minter}`);

            const response = await client.execute(account.address, options.contract, {
                update_minter: {
                    new_minter: new_minter
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    console.log(`Executing as ${account.address}`);
    program.parse();
}

main();