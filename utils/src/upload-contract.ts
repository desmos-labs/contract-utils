import { DesmosClient, SigningMode, OfflineSignerAdapter } from "@desmoslabs/desmjs";
import * as Config from "./config"
import { program } from "commander"
import * as fs from "fs";


interface ProgramOptions {
    contract: string
}

async function main() {
    program
        .name("Contract uploader")
        .requiredOption("--contract [contract]", "Path to the contract to upload");
    program.parse();

    const options = program.opts<ProgramOptions>();
    // Checks if the smart contract is present.
    if (!fs.existsSync(options.contract)) {
        console.error(`Smart contract ${options.contract} don't exist`);
        return;
    }
    // Create a signer from the mnemonic
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic, {
        hdPath: [Config.derivationPath],
        prefix: "desmos"
    });
    // Create the client to interact with the chain
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });

    // Read the contract in memory
    const contractContent = fs.readFileSync(options.contract);
    // Get the account to use to upload the contract code.
    const account = await signer.getCurrentAccount();

    console.log(`Uploading contract as ${account!.address}`);
    const uploadResult = await client.upload(account!.address, contractContent, "auto");

    console.log("Contract uploaded");
    console.log(uploadResult);
}

main();