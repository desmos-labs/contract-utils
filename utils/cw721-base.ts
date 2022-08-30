import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program } from "commander";
import * as Config from "./config"
import { AccountData } from "@cosmjs/amino";
import { InstantiateMsg, QueryMsgFor_Empty } from "@desmoslabs/contract-types/contracts/cw721-base";

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

    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");

    queryCommand
        .command("state")
        .description("Queries the contract state")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying state of ${options.contract}`)
            // Query contract info
            const config = await client.queryContractSmart(options.contract, { contract_info: {} } as QueryMsgFor_Empty);
            console.log("Contract info", config);
        });

        queryCommand
        .command("state")
        .description("Queries the contract state")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            console.log(`Querying state of ${options.contract}`)
            // Query contract info
            const config = await client.queryContractSmart(options.contract, { contract_info: {} } as QueryMsgFor_Empty);
            console.log("Contract info", config);
        });

    console.log(`Executing as ${account.address}`);
    program.parse();
}

main();