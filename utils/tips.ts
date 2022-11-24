import {DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import { program } from "commander";
import * as Config from "./config";
import { AccountData } from "@cosmjs/amino";
import { TipsClient } from "@desmoslabs/contract-types/contracts/Tips.client";
import { InstantiateMsg, ServiceFee, Tip, Coin } from "@desmoslabs/contract-types/contracts/Tips.types";
import { parseCoinList } from "./cli-parsing-utils";

function logTips(tips: Tip[]) {
    if (tips.length === 0) {
        console.log("Empty result")
    } else {
        tips.forEach((tip, i, array) => {
            console.log("Tip", i);
            console.log("Sender", tip.sender);
            console.log("Receiver", tip.receiver);
            console.log("Post id", tip.post_id);
            console.log("Amount", tip.amount);
            console.log("Block height", tip.block_height);
            if (i != array.length - 1) {
                console.log("")
            }
        })
    }
}

function mergeCoins(tipAmount: Coin[]): Coin[] {
    let coins: Record<string, number> = {};

    tipAmount.forEach(coin => {
        const value = coins[coin.denom];
        if (value === undefined) {
            coins[coin.denom] = parseInt(coin.amount);
        } else {
            coins[coin.denom] = value + parseInt(coin.amount);
        }
    })

    return Object.keys(coins).map(k => {
        return { denom: k, amount: coins[k].toString() } as Coin
    })
}

function computeFees(tips: Coin[], serviceFee: any): Coin[] {
    if (serviceFee?.fixed !== undefined) {
        return serviceFee.fixed.amount;
    } else if (serviceFee?.percentage !== undefined) {
        const percentage = parseFloat(serviceFee.percentage.value) / 100;
        return tips.map(c => {
            const coinAmount = parseFloat(c.amount);
            return { ...c, amount: Math.round(coinAmount * percentage).toString() }
        })
    } else {
        return []
    }
}

async function main() {
    const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
    const desmosClient = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
        gasPrice: Config.gasPrice
    });
    const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

    program.name("Tips contract utils")
        .description("Utility script to interact with the tips contract");

    program.command("init")
        .description("initialize a new instance of a tips contract")
        .requiredOption("--code-id <code-id>", "id of the contract to initialize", parseInt)
        .requiredOption("--subspace-id <subspace-id>", "id of subspace which is deploying the contract", parseInt)
        .requiredOption("--tips-history-size <tips-history-size>", "the number of records saved of a user tips history", parseInt)
        .requiredOption("--name <name>", "contract name")
        .option("--fixed-fee <coins>", "fixed fee applied to the tip amount. ex: 1000stkae,1000udsm", parseCoinList)
        .option("--percentage-fee <value-decimals>", "percentage fee applied to the tip. ex 1", parseFloat)
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
                    percentage: {
                        value: options.percentageFee.toString()
                    }
                } as ServiceFee
            }

            let instantiateMsg: InstantiateMsg = {
                admin: options.admin,
                tips_history_size: options.tipsHistorySize,
                service_fee: fee,
                subspace_id: options.subspace_id.toString()
            };
            const initResult = await desmosClient.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
            console.log("Contract initialized", initResult);
        })

    program.command("tip-user")
        .description("send a tip to an user")
        .argument("<receiver>", "bech32 encoded address of the user who will receive the tip")
        .requiredOption("--coins <coins>", "amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            console.log(`Sending tip to ${receiver}`);
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const config = await client.config();
            const fees = computeFees(options.coins, config.service_fee);
            const funds = mergeCoins([...options.coins, ...fees]);
            console.log("Tip fees", fees);
            console.log("Tip amount", options.coins);
            console.log("Sent amount", funds);

            const response = await client.sendTip({
                amount: options.coins,
                target: {
                    user_target: {
                        receiver: receiver,
                    }
                }
            }, "auto", "", funds);
            console.log(response);
        })

    program.command("tip-post")
        .description("send a tip to the author of a post to show support towards a specific content")
        .argument("<post-id>", "id of the post created by whoever will receive the tip", parseInt)
        .requiredOption("--coins <coins>", "amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (postId, options) => {
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const config = await client.config();
            const fees = computeFees(options.coins, config.service_fee);
            const funds = mergeCoins([...options.coins, ...fees]);
            console.log("Tip fees", fees);
            console.log("Tip amount", options.coins);
            console.log("Sent amount", funds);

            const response = await client.sendTip({
                amount: options.coins,
                target: {
                    content_target: {
                        post_id: postId.toString(),
                    }
                }
            }, "auto", "", funds);
            console.log(response);
        })

    program.command("update-fee")
        .description("updates the fee to be payed to send a tip")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .option("--fixed <coins>", "fixed fee applied to the tip amount. ex: 1000stkae,1000udsm", parseCoinList)
        .option("--percentage <value-decimals>", "percentage fee applied to the tip. ex 1", parseFloat)
        .action(async (options) => {
            let newFee : ServiceFee | undefined = undefined;

            if (options.fixed !== undefined) {
                console.log("Updating fee to fixed, new amount:", options.fixed);
                newFee = {
                    fixed: {
                        amount: options.fixed
                    }
                };
            } else if (options.percentage !== undefined) {
                console.log("Updating fee to percentage, new value:", options.percentage.toString());
                newFee = {
                    percentage: {
                        value: options.percentage.toString()
                    }
                };
            } else {
                console.log("Removing service fee");
            }
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.updateServiceFee({ newFee }, "auto", "", options.coins);
            console.log(response);
        });

    program.command("update-admin")
        .description("updates who have the admin rights over the contract")
        .argument("<address>", "new admin's bech32 address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (newAdmin, options) => {
            console.log(`Setting new admin address to ${newAdmin}`);
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.updateAdmin({ newAdmin });
            console.log(response);
        });

    program.command("update-tips-record-size")
        .description("updates the amount of tips records stored from the contract")
        .argument("<new-size>", "new tips record size", parseInt)
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (newSize, options) => {
            console.log(`Setting new tips record size ${newSize}`);
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.updateSavedTipsHistorySize({ newSize });
            console.log(response);
        });

    program.command("claim-fees")
        .description("claim the fees collected from the contract")
        .argument("<receiver>", "bech32 address to which they will be sent")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            console.log(`Claiming contract fees and send to ${receiver}`);
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.claimFees({ receiver });
            console.log(response);
        });

    const queryCommand = program.command("query")
        .description("subcommand to query the contract");

    queryCommand.command("config")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (options) => {
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.config();
            console.log("Admin", response.admin);
            console.log("Subspace", response.subspace_id);
            console.log("saved_tips_record_size:", response.tips_history_size);
            console.log("fees", JSON.stringify(response.service_fee));
        })

    queryCommand.command("sent-tips")
        .description("queries the tips sent from an user")
        .argument("<sender>", "sender's bech32 encoded address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (sender, options) => {
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.userSentTips({ user: sender });
            logTips(response.tips);
        })

    queryCommand.command("received-tips")
        .description("queries the tips received from an user")
        .argument("<receiver>", "receiver's bech32 encoded address")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (receiver, options) => {
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.userReceivedTips({ user: receiver });
            logTips(response.tips);
        })

    queryCommand.command("post-received-tips")
        .description("queries the tips sent to a post")
        .argument("<post-id>", "id of the post of interest")
        .requiredOption("--contract <contract>", "bech32 encoded contract address")
        .action(async (postId, options) => {
            const client = new TipsClient(desmosClient, account.address, options.contract);
            const response = await client.postReceivedTips({ postId: postId.toString() });
            logTips(response.tips);
        })

    console.log(`Executing as ${account.address}`);
    program.parse();
}

main();