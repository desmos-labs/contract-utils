import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program, Command } from "commander";
import * as Config from "./config";
import { AccountData } from "@cosmjs/amino";
import { Cw721RemarkablesClient } from "@desmoslabs/contract-types/contracts/Cw721Remarkables.client";
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
        .requiredOption("--rarity-level <rarity-level>", "Level of rarity to be minted", parseInt)
        .requiredOption("--subspace-id <subspace-id>", "Id of the subspace which includes the post", parseInt)
        .requiredOption("--post-id <post-id>", "Id of the post to be the remarkables NFT", parseInt)
        .option("--token-uri <token-uri>", "Universal resource identifier for this NFT")
        .action(async (options) => {
            const client = new Cw721RemarkablesClient(desmosClient, account.address, options.contract);
            const response = await client.mint({
                tokenId: options.tokenId,
                owner: options.owner,
                tokenUri: options.tokenUri,
                extension: {
                    rarity_level: options.rarityLevel,
                    subspace_id: options.subspaceId.toString(),
                    post_id: options.postId.toString()
                },
            });
            console.log(response);
        });

}
main();