import { DesmosClient, SigningMode, OfflineSignerAdapter } from "@desmoslabs/desmjs";
import * as Config from "./config"
import { program } from "commander"
import {parseIpfsUri, parseCWTimestamp} from "./cli-parsing-utils";
import { InstantiateMsg } from "@desmoslabs/contract-types/contracts/poap";


interface ProgramOptions {
    codeId: number,
    cw721CodeId: number,
    name: string,
    symbol: string,
    start: string,
    end: string,
    addressLimit: number,
    poapUri: URL,
    eventUri: URL,
    creator: string,
    minter: string,
    admin: string,
}

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic, {
        hdPath: [Config.derivationPath],
        prefix: "desmos"
    });
    const account = await signer.getCurrentAccount();

    program
        .name("Poap contract initiator")
        .requiredOption("--code-id <code-id>", "Id of the contract to initialize", parseInt)
        .requiredOption("--cw721-code-id <cw721-code-id>", "Id of the cw721 contract that will be initialized from the poap contract", parseInt)
        .requiredOption("--name <name>", "Poap name")
        .requiredOption("--symbol <symbol>", "Poap symbol")
        .requiredOption("--start <start>", "Datetime when the event will start in RFC3339 format (2022-12-31:10:00:00)", parseCWTimestamp)
        .requiredOption("--end <end>", "Date when the event will end in RFC3339 format (2022-12-31:10:00:00)", parseCWTimestamp)
        .requiredOption("--address-limit <address_limit>", "Max number of poap that an user can receive", parseInt)
        .requiredOption("--poap-uri <poap_uri>", "ipfs poap uri that contains the poap metadata", parseIpfsUri)
        .requiredOption("--event-uri <event_uri>", "ipfs event uri that contains the event metadata", parseIpfsUri)
        .option("--creator <creator>", "Bech32 address of who is creating the event", account!.address)
        .option("--minter <minter>", "Bech32 address of who will have the minting rights", account!.address)
        .option("--admin <admin>", "Bech32 address of who will have the contract admin rights", account!.address);
    program.parse();

    const options = program.opts<ProgramOptions>();
    console.log(options);

    // Create the client to interact with the chain
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });

    console.log(`Initializing contract with code ${options.codeId}`);
    let instantiateMsg: InstantiateMsg = {
        admin: options.admin,
        minter: options.minter,
        cw721_code_id: options.cw721CodeId.toString(),
        event_info: {
            creator: options.creator,
            base_poap_uri: options.poapUri.toString(),
            event_uri: options.eventUri.toString(),
            start_time: options.start,
            end_time: options.end,
            per_address_limit: options.addressLimit
        },
        cw721_initiate_msg: {
            name: options.name,
            minter: options.minter,
            symbol: options.symbol
        }
    }

    const initResult = await client.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
    console.log("Contract initialized", initResult);
}

main();