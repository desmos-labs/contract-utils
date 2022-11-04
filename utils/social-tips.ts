import {Coin, DesmosClient, OfflineSignerAdapter, SigningMode} from "@desmoslabs/desmjs";
import {program} from "commander";
import * as Config from "./config"
import {AccountData} from "@cosmjs/amino";
import {
  ExecuteMsg,
  InstantiateMsg,
  QueryConfigResponse,
  QueryMsg,
} from "@desmoslabs/contract-types/contracts/social-tips";
import {parseCoinList} from "./cli-parsing-utils";

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

async function main() {
  const signer = await OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, Config.mnemonic);
  const client = await DesmosClient.connectWithSigner(Config.rpcEndpoint, signer, {
    gasPrice: Config.gasPrice
  });
  const account: AccountData = (await signer.getCurrentAccount()) as AccountData;

  program.name("Social tips contract utils")
    .description("Utility script to interact with the social-tips contract");

  program.command("init")
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

  program.command("tip-user")
    .description("send a tip to an user")
    .argument("<application>", "application name")
    .argument("<handle>", "user handle in the provided application")
    .requiredOption("--coins <coins>", "amount of coins to tip to the user. Comma separated list of coins ex: 100udsm,100uatom", parseCoinList)
    .requiredOption("--contract <contract>", "bech32 encoded contract address")
    .option("--owner-index <owner-index>", "index of the address to which the tip will be sent in case the user have connected the application to multiple profiles")
    .action(async (receiver, options) => {
      const funds = mergeCoins([...options.coins]);
      console.log("Tip amount", options.coins);

      const response = await client.execute(account.address, options.contract, {
        send_tip: {
          application
        }
      } as ExecuteMsg, "auto", undefined, funds);
      console.log(response);
    })


  console.log(`Executing as ${account.address}`);
  program.parse();
}

main();
