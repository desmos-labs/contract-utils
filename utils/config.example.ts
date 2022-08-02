import { Slip10RawIndex, HdPath } from "@cosmjs/crypto";
import {GasPrice} from "@desmoslabs/desmjs";


// The account seed phrase
export const mnemonic = ""
// Derivation path use to derive the mnemonic
export const derivationPath: HdPath = [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(852),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(0),
];
// Rpc endpoint used to interact with the chaim
// Mainnet
export const rpcEndpoint = "https://rpc.mainnet.desmos.network"
// Testnet
//export const rpcEndpoint = "https://rpc.morpheus.desmos.network"

// Default gas prices
// Mainnet default gas price
export const gasPrice = GasPrice.fromString("0.01udsm");
// Testnet default gas price
//export const gasPrice = GasPrice.fromString("0.01udaric");

