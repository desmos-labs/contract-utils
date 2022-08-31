import { GasPrice, makeDesmosPath } from "@desmoslabs/desmjs";


// The account seed phrase
export const mnemonic = ""
// Derivation path use to derive the mnemonic
export const derivationPath = makeDesmosPath();
// Rpc endpoint used to interact with the chaim
// Mainnet
export const rpcEndpoint = "https://rpc.mainnet.desmos.network"
// Testnet
//export const rpcEndpoint = "https://rpc.morpheus.desmos.network"
// Localnet
//export const rpcEndpoint = "http://localhost:26657"

// Default gas prices
// Mainnet default gas price
export const gasPrice = GasPrice.fromString("0.01udsm");
// Testnet default gas price
//export const gasPrice = GasPrice.fromString("0.01udaric");
// Localnet default gas price
//export const gasPrice = GasPrice.fromString("0.01stake");

