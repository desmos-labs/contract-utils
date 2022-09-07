import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program } from "commander";
import * as Config from "./config"
import {AccountData} from "@cosmjs/amino";
import {
    ExecuteMsg,
    InstantiateMsg,
    QueryConfigResponse,
    QueryMsg, Tip,
    TipsResponse
} from "@desmoslabs/contract-types/contracts/tips";
import {parseCoinList} from "./cli-parsing-utils";

function logTips(tips: Tip[]){
    tips.forEach((tip, i, array) => {
        console.log("Tip", i);
        console.log("Sender", tip.sender);
        console.log("Receiver", tip.receiver);
        console.log("Amount", tip.amount);
        if (i != array.length - 1) {
            console.log("")
        }
    })
}

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

    program.name("Tips contract utils")
        .description("Utility script to interact with the tips contract");

    program.command("init")
        .description("Initialize a new instance of a cw721 base contract")
        .requiredOption("--code-id <code-id>", "Id of the contract to initialize", parseInt)
        .requiredOption("--subspace <subspace>", "Application which is deploying the contract", parseInt)
        .requiredOption("--saved-tips-threshold <saved-tips-threshold>", "The number of records saved of a user tips histor", parseInt)
        .requiredOption("--fixed-fee <fixed-fee>", "Fixed fee applied to the tip amount. ex: 1000stkae,1000udsm", parseCoinList)
        .requiredOption("--name <name>", "Contract name")
        .option("--admin <admin>", "Bech32 address of who will have the admin rights", account!.address)
        .action(async (options) => {
            console.log(`Initializing tips contract`, options);
            console.log(`Initializing tips contract ${options.codeId}`);

            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                saved_tips_threshold: options.savedTipsThreshold,
                service_fee: {
                    fixed: {
                        amount: options.fixedFee
                    }
                },
                subspace_id: options.subspace.toString()
            };
            const initResult = await client.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        })

    program.command("tip-user")
        .description("Send a tip to an user")
        .requiredOption("--coins <coins>", "Amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
        .requiredOption("--receiver <receiver>", "Bech32 encoded address of the user who will receive the tip")
        .requiredOption("--contract <contract>", "Bech32 encoded contract address")
        .action(async (options) => {
            const response = await client.execute(account.address, options.contract, {send_tip: {
                target: {
                    user_target: {
                        receiver: options.receiver,
                    }
                }
                }} as ExecuteMsg, "auto", undefined, options.coins);
            console.log(response);
        })

    const queryCommand = program.command("query")
        .description("Subcommand to query the contract");

    queryCommand.command("config")
        .requiredOption("--contract <contract>", "Bech32 encoded contract address")
        .action(async (options) => {
            const response = await client.queryContractSmart(options.contract, {
                config: {}
            } as QueryMsg) as QueryConfigResponse;

            console.log("Admin", response.admin);
            console.log("Subspace", response.subspace_id);
            console.log("saved_tips_record_threshold:", response.saved_tips_record_threshold);
            const service_fee = response.service_fee as {fixed: {amount: any}};
            console.log("fixed fees", service_fee.fixed.amount);
        })

    queryCommand.command("user-sent-tips")
        .description("Queries the tips sent from an user")
        .requiredOption("--contract <contract>", "Bech32 encoded contract address")
        .requiredOption("--sender <sender>", "Sender's bech32 encoded address")
        .action(async (options) => {
            const response = await client.queryContractSmart(options.contract, {
                user_sent_tips: {
                    user: options.sender
                }
            } as QueryMsg) as TipsResponse;

            logTips(response.tips);
        })

    queryCommand.command("user-received-tips")
        .description("Queries the tips received from an user")
        .requiredOption("--contract <contract>", "Bech32 encoded contract address")
        .requiredOption("--receiver <sender>", "Receiver's bech32 encoded address")
        .action(async (options) => {
            const response = await client.queryContractSmart(options.contract, {
                user_received_tips: {
                    user: options.receiver
                }
            } as QueryMsg) as TipsResponse;

            logTips(response.tips);
        })

    queryCommand.command("post-received-tips")
        .description("Queries the tips sent to a post")
        .requiredOption("--contract <contract>", "Bech32 encoded contract address")
        .requiredOption("--post-id <post-id>", "Id of the post of interest")
        .action(async (options) => {
            const response = await client.queryContractSmart(options.contract, {
                post_received_tips: {
                    post_id: options.postId.toString()
                }
            } as QueryMsg) as TipsResponse;

            logTips(response.tips);
        })

    console.log(`Executing as ${account.address}`);
    program.parse();
}

main();