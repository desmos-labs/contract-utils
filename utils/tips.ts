import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import {InvalidArgumentError, InvalidOptionArgumentError, program} from "commander";
import * as Config from "./config"
import {AccountData} from "@cosmjs/amino";
import {
    ExecuteMsg,
    InstantiateMsg,
    QueryConfigResponse,
    QueryMsg, ServiceFee, Tip,
    TipsResponse
} from "@desmoslabs/contract-types/contracts/tips";
import {parseCoinList} from "./cli-parsing-utils";

function logTips(tips: Tip[]) {
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

function parsePercentageFee(number: string): { value: string, decimals: number } {
    const trimmed = number.trim();
    const parsed = parseFloat(trimmed);
    if (isNaN(parsed)) {
        throw new InvalidArgumentError("The provided percentage value is not a number");
    }

    const [_, decimal] = number.split(".");
    return {
        value: Math.ceil(parsed * Math.pow(10, decimal?.length ?? 0)).toString(),
        decimals: decimal?.length ?? 0
    }

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
        .description("initialize a new instance of a tips contract")
        .requiredOption("--code-id <code-id>", "id of the contract to initialize", parseInt)
        .requiredOption("--subspace <subspace>", "application which is deploying the contract", parseInt)
        .requiredOption("--saved-tips-threshold <saved-tips-threshold>", "the number of records saved of a user tips history", parseInt)
        .requiredOption("--name <name>", "contract name")
        .option("--fixed-fee <coins>", "fixed fee applied to the tip amount. ex: 1000stkae,1000udsm", parseCoinList)
        .option("--percentage-fee <value-decimals>", "percentage fee applied to the tip. ex 1", parsePercentageFee)
        .option("--admin <admin>", "bech32 address of who will have the admin rights", account!.address)
        .action(async (options) => {
            let fee = null;

            if (options.fixedFee !== undefined) {
                fee = {
                    fixed: {
                        amount: options.fixedFee
                    }
                } as ServiceFee
            } else if (options.percentageFee !== undefined) {
                fee = {
                    percentage: options.percentageFee
                } as ServiceFee
            }

            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                saved_tips_threshold: options.savedTipsThreshold,
                service_fee: fee,
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