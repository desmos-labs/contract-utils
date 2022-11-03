import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program, Command } from "commander";
import * as Config from "./config"
import { AccountData } from "@cosmjs/amino";
import { ExecuteMsg } from "@desmoslabs/contract-types/contracts/cw721-remarkables";
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

function buildExecuteCommands(program: Command, client: DesmosClient, account: AccountData) {
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
            const response = await client.execute(account.address, options.contract, {
                mint: {
                    token_id: options.tokenId,
                    owner: options.owner,
                    token_uri: options.tokenUri,
                    extension: {
                        rarity_level: options.rarityLevel,
                        subspace_id: options.subspaceId.toString(),
                        post_id: options.postId.toString()
                    },
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

}
main();