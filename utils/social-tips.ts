import { DesmosClient, OfflineSignerAdapter, SigningMode } from "@desmoslabs/desmjs";
import {Command, program} from "commander";
import * as Config from "./config"
import { AccountData } from "@cosmjs/amino";
import { SocialTipsClient } from "@desmoslabs/contract-types/contracts/SocialTips.client";
import { InstantiateMsg, Coin } from "@desmoslabs/contract-types/contracts/SocialTips.types";
import { parseCoinList } from "./cli-parsing-utils";

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
    return {denom: k, amount: coins[k].toString()} as Coin
  })
}

function setupExecuteCommand(command: Command, client: DesmosClient, account: AccountData) {
  command.command("init")
    .description("initialize a new instance of a social-tips contract")
    .requiredOption("--code-id <code-id>", "id of the contract to initialize", parseInt)
    .requiredOption("--max-pending-tips <max-pending-tips>", "id of subspace which is deploying the contract", parseInt)
    .requiredOption("--max-sent-pending-tips <max-sent-pending-tips>", "the number of records saved of a user tips history", parseInt)
    .requiredOption("--name <name>", "contract name")
    .option("--admin <admin>", "bech32 address of who will have the admin rights", account!.address)
    .action(async (options) => {
      let instantiateMsg: InstantiateMsg = {
        max_pending_tips: options.maxPendingTips,
        max_sent_pending_tips: options.maxSentPendingTips,
        admin: options.admin
      };
      // @ts-ignore
      const initResult = await client.instantiate(account!.address, options.codeId, instantiateMsg, options.name, "auto");
      console.log("Contract initialized", initResult);
    })

  command.command("tip-user")
    .description("send a tip to an user")
    .argument("<application>", "application name")
    .argument("<handle>", "user handle in the provided application")
    .requiredOption("--coins <coins>", "amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .option("--owner-index <owner-index>", "index of the address to which the tip will be sent in case the user have connected the application to multiple profiles")
    .action(async (application, handle, options) => {
      const funds = mergeCoins([...options.coins]);
      console.log("Tip amount", options.coins);

      let contractClient = new SocialTipsClient(client, account!.address, options.contract);
      let response = await contractClient.sendTip({
        application,
        handle,
        ownerIndex: options.ownerIndex
      }, "auto", undefined, funds);
      console.log(response)
    });


  command.command("claim-tips")
    .description("claim the user pending tips")
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (options) => {
      let contractClient = new SocialTipsClient(client, account!.address, options.contract);
      let response = await contractClient.claimTips("auto");
      console.log(response)
    });

  command.command("update-admin")
    .description("updates who have the admin rights over the contract")
    .argument("<address>", "new admin's bech32 address")
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (newAdmin, options) => {
      console.log(`Setting new admin address to ${newAdmin}`);
      const contractClient = new SocialTipsClient(client, account.address, options.contract);
      const response = await contractClient.updateAdmin({
        newAdmin
      });
      console.log(response);
    });

  command.command("update-max-pending-tips")
    .description("updates the maximum number of pending tips that can be associated to an user")
    .argument("<max-pending-tips>", "new max pending tips", parseInt)
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (maxPendingTips, options) => {
      const contractClient = new SocialTipsClient(client, account.address, options.contract);
      const response = await contractClient.updateMaxPendingTips({
        value: maxPendingTips
      });
      console.log(response);
    });

  command.command("update-max-sent-pending-tips")
    .description("updates the maximum allowed number of tips that the contracts can collect from a single sender")
    .argument("<max-sent-pending-tips>", "new max sent pending tips", parseInt)
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (maxSentPendingTips, options) => {
      const contractClient = new SocialTipsClient(client, account.address, options.contract);
      const response = await contractClient.updateMaxSentPendingTips({
        value: maxSentPendingTips
      });
      console.log(response);
    });

  command.command("remove-pending-tip")
    .description("removes a tip that hasn't been collected from the receiver")
    .argument("<application>", "application name")
    .argument("<handle>", "user handle in the provided application")
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (application, handle, options) => {
      let contractClient = new SocialTipsClient(client, account!.address, options.contract);
      let response = await contractClient.removePendingTip({
        application,
        handle,
      }, "auto");
      console.log(response)
    });
}

function setupQueryCommand(command: Command, client: DesmosClient, account: AccountData) {
  command.command("user-pending-tips")
    .description("queries the tips that can be collected from an user")
    .argument("<address>", "users's bech32 address")
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (address, options) => {
      let contractClient = new SocialTipsClient(client, account!.address, options.contract);
      let response = await contractClient.userPendingTips({
        user: address
      });
      console.log(response)
    });

  command.command("unclaimed-sent-tips")
    .description("queries the tips that an user has sent that aren't be claimed")
    .argument("<address>", "users's bech32 address")
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (address, options) => {
      let contractClient = new SocialTipsClient(client, account!.address, options.contract);
      let response = await contractClient.unclaimedSentTips({
        user: address
      });
      console.log(response)
    });

  command.command("config")
    .description("queries the tips that an user has sent that aren't be claimed")
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .action(async (options) => {
      let contractClient = new SocialTipsClient(client, account!.address, options.contract);
      let response = await contractClient.config();
      console.log(response)
    });
}

async function main() {
  const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
  const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
    gasPrice: Config.gasPrice
  });
  const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

  program.name("Social tips contract utils")
    .description("Utility script to interact with the social-tips contract");
  setupExecuteCommand(program, client, account);

  // Query command
  const queryCommand = program.command("query")
    .description("subcommand to query the contract");
  setupQueryCommand(queryCommand, client, account);

  console.log(`Executing as ${account.address}`);
  program.parse();
}

main();
