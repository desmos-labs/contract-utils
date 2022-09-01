import {DesmosClient, OfflineSignerAdapter, SigningMode} from "@desmoslabs/desmjs";
import {program} from "commander";
import * as Config from "./config"
import {ExecuteMsg, InstantiateMsg, QueryMsg} from "@desmoslabs/contract-types/contracts/poap-manager";
import {AccountData} from "@cosmjs/amino";
import {parseCWTimestamp, parseIpfsUri} from "./cli-parsing-utils";

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

    program.name("Poap Manager contract utils")
        .description("Utility script to interact with the poap manager contract");

    program.command("init")
        .description("Initialize a new instance of a poap manager contract")
        .requiredOption("--code-id <code-id>", "Id of the contract to initialize", parseInt)
        .requiredOption("--poap-code-id <poap-code-id>", "Id of the poap contract that will be initialized from the poap manager contract", parseInt)
        .requiredOption("--cw721-code-id <cw721-code-id>", "Id of the cw721 contract that will be initialized from the poap contract", parseInt)
        .requiredOption("--name <name>", "Poap name")
        .requiredOption("--symbol <symbol>", "Poap symbol")
        .requiredOption("--start <start>", "Datetime when the event will start in RFC3339 format (2022-12-31:10:00:00)", parseCWTimestamp)
        .requiredOption("--end <end>", "Date when the event will end in RFC3339 format (2022-12-31:10:00:00)", parseCWTimestamp)
        .requiredOption("--address-limit <address_limit>", "Max number of poap that an user can receive", parseInt)
        .requiredOption("--poap-uri <poap_uri>", "IPFS uri where the event's metadata are stored", parseIpfsUri)
        .option("--creator <creator>", "Bech32 address of who is creating the event", account!.address)
        .option("--admin <admin>", "Bech32 address of who will have the contract admin rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing contract with code ${options.codeId}`);
            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                poap_code_id: options.poapCodeId.toString(),
                poap_instantiate_msg: {
                    admin: options.admin,
                    // Just a string since this will be replaced from the contract.
                    minter: "contract-address",
                    cw721_code_id: options.cw721CodeId.toString(),
                    event_info: {
                        creator: options.creator,
                        poap_uri: options.poapUri.toString(),
                        start_time: options.start,
                        end_time: options.end,
                        per_address_limit: options.addressLimit
                    },
                    cw721_initiate_msg: {
                        name: options.name,
                        // Just a string since this will be replaced from the contract.
                        minter: "contract-address",
                        symbol: options.symbol
                    }
                }
            }

            const initResult = await client.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        })

    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");

    queryCommand
        .command("config")
        .description("Queries the contract configs")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying state of ${options.contract}`)
            // Query config
            const config = await client.queryContractSmart(options.contract, {config: {}} as QueryMsg);
            console.log("Config", config);
        });

    program.command("claim")
        .description("Claim a poap")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            const msg: ExecuteMsg = { claim: {} };
            const response = await client.execute(account.address, options.contract, msg, "auto");
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

    console.log(`Executing as ${account.address}`);
    program.parse();
}

main();