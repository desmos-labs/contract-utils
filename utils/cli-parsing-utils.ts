import { InvalidArgumentError } from "commander"

/**
 * Parse a string and ensure that is a valid ipfs url.
 * @param rawUri - The uri that will be parsed.
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
 * @param rawDateTime - The date that will be parsed.
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