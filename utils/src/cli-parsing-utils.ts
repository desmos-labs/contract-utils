import { InvalidArgumentError } from "commander"

/**
 * Parse a string and ensure that is a valid ipfs url.
 * @param rawUri - The string to be parsed as ipfs url.
 */
export function parseIpfsUri(rawUri: string): URL {
    let url: URL;
    try {
        url = new URL(rawUri);
    } catch (e) {
        throw new InvalidArgumentError('Not a valid uri');
    }

    if (url.protocol !== 'ipfs:') {
        throw new InvalidArgumentError('Not a valid IPFS uri');
    }

    return url;
}

/**
 * Parses a string and ensure that is a RFC3339 encoded date time
 * and converts it into the CosmWASM Timestamp struct (nanoseconds from epoch as string).
 * @param rawDateTime - The string to be parsed as timestamp.
 */
export function parseCWTimestamp(rawDateTime: string): string {
    const date = new Date(rawDateTime);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new InvalidArgumentError('Not a valid RFC3339 date time, example 2021-07-04T18:10:00');
    }

    // Converts the milliseconds to nanoseconds
    const nanos = date.getTime() * 1000000;

    return nanos.toString();
}

/**
 * Parse a string and ensure that represents a valid boolean value.
 * @param rawBool - The string to be parsed as boolean.
 */
export function parseBool(rawBool: string): boolean {
    const lowerCase = rawBool.toLowerCase();
    if (lowerCase === "true") {
        return true;
    } else if (lowerCase === "false") {
        return false;
    } else {
        throw new InvalidArgumentError('The enable flag should be "true" or "false"');
    }
}

/**
 * Function that checks if the provided string is a number or not.
 * @param string - The string to check.
 */
function isNumber(string: string) {
    if (string.trim() === '') {
        return false;
    }

    return !isNaN(parseInt(string));
}

/**
 * Parse a serialized coin.
 * example: 1000udsm will become { amount: '1000', denom: 'udsm' }.
 * @param rawCoin - The string to be parsed.
 */
export function parseCoin(rawCoin: string): { denom: string, amount: string } {
    let startOfDenom;
    let denomFound;

    // Check that te first value is a number
    if(!isNumber(rawCoin[0])) {
        throw new InvalidArgumentError(`Invalid coin: ${rawCoin} can't find coin amount`);
    }

    // Find the first non numeric char that is where the denom begins
    for (startOfDenom = 0, denomFound = false; startOfDenom < rawCoin.length && denomFound == false; startOfDenom++) {
        if('abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ'.indexOf(rawCoin[startOfDenom]) !== -1) {
            denomFound = true;
            break;
        }
    }

    // Throw error if we haven't find the denom
    if (!denomFound) {
        throw new InvalidArgumentError(`Invalid coin: ${rawCoin} can't find coin denom`);
    }

    // Parse the raw coin
    const amount = rawCoin.slice(0, startOfDenom);
    const denom = rawCoin.slice(startOfDenom);

    // Sanity check on the parsed values
    if (isNaN(parseInt(amount)) || denom.length === 0) {
        throw new InvalidArgumentError(`Invalid coin: ${rawCoin} parsed, amount: ${amount} denom: ${denom}`);
    }

    return {
        denom,
        amount
    }
}

/**
 * Parse a comma separated list of coins.
 * @param rawCoinList - The string to be parsed as list of Coin.
 */
export function parseCoinList(rawCoinList: string): {denom: string, amount: string}[] {
    return rawCoinList.split(",").map(parseCoin);
}