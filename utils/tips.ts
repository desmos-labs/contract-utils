import {DesmosClient, OfflineSignerAdapter, SigningMode} from "@desmoslabs/desmjs";
import {InvalidArgumentError, program} from "commander";
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
        .description("send a tip to an user")
        .argument("<receiver>", "bech32 encoded address of the user who will receive the tip")
        .requiredOption("--coins <coins>", "amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            console.log(`Sending tip to ${receiver}`)
            const response = await client.execute(account.address, options.contract, {
                send_tip: {
                    target: {
                        user_target: {
                            receiver: receiver,
                        }
                    }
                }
            } as ExecuteMsg, "auto", undefined, options.coins);
            console.log(response);
        })

    program.command("tip-post")
        .description("send a tip to the author of a post to show support towards a specific content")
        .argument("<post-id>", "id of the post created by whoever will receive the tip", parseInt)
        .requiredOption("--coins <coins>", "amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (postId, options) => {
            console.log(`Sending tip to the author of ${postId}`);
            const response = await client.execute(account.address, options.contract, {
                update_service_fee: {
                    target: {
                        content_target: {
                            post_id: postId.toString(),
                        }
                    }
                }
            } as ExecuteMsg, "auto", undefined, options.coins);
            console.log(response);
        })

    program.command("update-fee")
        .description("updates the fee to be payed to send a tip")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .option("--fixed <coins>", "fixed fee applied to the tip amount. ex: 1000stkae,1000udsm", parseCoinList)
        .option("--percentage <value-decimals>", "percentage fee applied to the tip. ex 1", parsePercentageFee)
        .action(async (options) => {
            let new_fee = null;

            if (options.fixed !== undefined) {
                console.log("Updating fee to fixed, new amount:", options.fixed);
                new_fee = {
                    fixed: {
                        amount: options.fixed
                    }
                } as ServiceFee
            } else if (options.percentage !== undefined) {
                console.log("Updating fee to percentage, new value:", options.percentage);
                new_fee = {
                    percentage: options.percentage
                } as ServiceFee
            } else {
                console.log("Removing service fee");
            }

            const response = await client.execute(account.address, options.contract, {
                update_service_fee: {
                    new_fee
                }
            } as ExecuteMsg, "auto", undefined, options.coins);
            console.log(response);
        });

    program.command("update-admin")
        .description("updates who have the admin rights over the contract")
        .argument("<address>", "new admin's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (new_admin, options) => {
            console.log(`Setting new admin address to ${new_admin}`);

            const response = await client.execute(account.address, options.contract, {
                update_admin: {
                    new_admin
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program.command("update-tips-record-threshold")
        .description("updates the amount of tips records stored from the contract")
        .argument("<new-threshold>", "new tips record threshold", parseInt)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (new_threshold, options) => {
            console.log(`Setting new tips record threshold ${new_threshold}`);

            const response = await client.execute(account.address, options.contract, {
                update_saved_tips_record_threshold: {
                    new_threshold
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    program.command("claim-fee")
        .description("claim the fee collected from the contract")
        .argument("<receiver>", "bech32 address to which they will be sent")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            console.log(`Claiming contract fee and send to ${receiver}`);

            const response = await client.execute(account.address, options.contract, {
                claim_fees: {
                    receiver
                }
            } as ExecuteMsg, "auto");
            console.log(response);
        });

    const queryCommand = program.command("query")
        .description("subcommand to query the contract");

    queryCommand.command("config")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            const response = await client.queryContractSmart(options.contract, {
                config: {}
            } as QueryMsg) as QueryConfigResponse;

            console.log("Admin", response.admin);
            console.log("Subspace", response.subspace_id);
            console.log("saved_tips_record_threshold:", response.saved_tips_record_threshold);
            console.log("fees", JSON.stringify(response.service_fee));
        })

    queryCommand.command("user-sent-tips")
        .description("queries the tips sent from an user")
        .argument("<sender>", "sender's bech32 encoded address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (sender, options) => {
            const response = await client.queryContractSmart(options.contract, {
                user_sent_tips: {
                    user: sender
                }
            } as QueryMsg) as TipsResponse;

            logTips(response.tips);
        })

    queryCommand.command("user-received-tips")
        .description("queries the tips received from an user")
        .argument("<receiver>", "receiver's bech32 encoded address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            const response = await client.queryContractSmart(options.contract, {
                user_received_tips: {
                    user: receiver
                }
            } as QueryMsg) as TipsResponse;

            logTips(response.tips);
        })

    queryCommand.command("post-received-tips")
        .description("queries the tips sent to a post")
        .argument("<post-id>", "id of the post of interest")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (postId, options) => {
            const response = await client.queryContractSmart(options.contract, {
                post_received_tips: {
                    post_id: postId.toString()
                }
            } as QueryMsg) as TipsResponse;

            logTips(response.tips);
        })

    console.log(`Executing as ${account.address}`);
    program.parse();
}

main();