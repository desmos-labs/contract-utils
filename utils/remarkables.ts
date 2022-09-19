import {DesmosClient, OfflineSignerAdapter, SigningMode} from "@desmoslabs/desmjs";
import {program} from "commander";
import * as Config from "./config"
import {ExecuteMsg, InstantiateMsg, QueryMsg} from "@desmoslabs/contract-types/contracts/remarkables";
import {AccountData} from "@cosmjs/amino";
import {parseCWTimestamp, parseIpfsUri} from "./cli-parsing-utils";

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
        .requiredOption("--subspace-id <subspace-id>", "Id of the subspace where remarkables contract operates")
        .option("--admin <admin>", "Bech32 address of who will have the contract admin rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing contract with code ${options.codeId}`);
        });
}

main();