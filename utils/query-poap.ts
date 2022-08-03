import { DesmosClient } from "@desmoslabs/desmjs";
import * as Config from "./config"
import { program } from "commander"
import { QueryMsg } from "@desmoslabs/contract-types/contracts/poap";


interface ProgramOptions {
    address: string,
}

async function main() {

    program.name("POAP Contract config querier")
        .requiredOption("--address <address> Bech32 contract address")

    program.parse();
    const { address } = program.opts<ProgramOptions>();

    console.log(`Quering config for contract ${address}`)

    const client = await DesmosClient.connect(Config.rpcEndpoint);
    // Query config
    const config = await client.queryContractSmart(address, { config: {} } as QueryMsg);
    console.log("Config", config);

    // Query event info
    const event_info = await client.queryContractSmart(address, { event_info: {} } as QueryMsg);
    console.log("EventInfo", event_info);
}

main();