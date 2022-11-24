import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program, Command } from "commander";
import * as Config from "./config"
import { AccountData } from "@cosmjs/amino";
import { Cw721PoapClient } from "@desmoslabs/contract-types/contracts/Cw721Poap.client";
import { createCw721Program } from "./cw721-utils";

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;
    createCw721Program(program, client, account)
    buildExecuteCommands(program, client, account);
    console.log(`Executing as ${account.address}`);
    program.parse();
}

function buildExecuteCommands(program: Command, desmosClient: DesmosClient, account: AccountData) {
    program
        .command("mint")
        .description("Mint a new NFT, can only be called by the contract minter")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .requiredOption("--token-id <token-id>", "Id of the token")
        .requiredOption("--owner <owner>", "Owner of the newly minter NFT")
        .option("--token-uri <token-uri>", "Universal resource identifier for this NFT")
        .action(async (options) => {
            const client = new Cw721PoapClient(desmosClient, account.address, options.contract);
            const response = await client.mint({
                tokenId: options.tokenId,
                owner: options.owner,
                tokenUri: options.tokenUri,
                extension: {
                    claimer: options.owner
                },
            });
            console.log(response);
        });

}
main();