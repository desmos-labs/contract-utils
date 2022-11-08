import codegen, { ContractFile } from '@cosmwasm/ts-codegen';
import fs from "fs";
import path from "path";

const CONTRACTS_OUTPUT_DIR = "./contracts";
const DEFAULT_CONFIG = {
  schemaRoots: [
    process.env.CONTRACTS_ROOT || path.join(__dirname, "../schemas"), process.env.CONTRACTS_ROOT || path.join(__dirname, "../cw721-schemas")],
};

function removeDirectory(dir: string) {
  try {
    fs.rmSync(dir, { recursive: true });
  } catch (err) {
    console.error(`Error while deleting ${dir}.`);
  }
}

function getSchemaDirectories(
  rootDir: string,
): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const directories: string[][] = [];
    // get all the schema directories in all the contract directories
    fs.readdir(rootDir, (err, dirEntries) => {
      if (err) {
        console.error(err);
        return;
      }
      if (!dirEntries) {
        console.warn(`no entries found in ${rootDir}`);
        resolve([]);
        return;
      }
      dirEntries.forEach((entry) => {
        directories.push([path.join(rootDir, entry), entry]);
      });
      resolve(directories);
    });
  });
}

async function run(contracts: ContractFile[], outPath: string) {
  await codegen({
    contracts,
    outPath,

    // options are completely optional ;)
    options: {
      bundle: {
        bundleFile: 'index.ts',
        scope: 'contracts'
      },
      types: {
        enabled: true
      },
      client: {
        enabled: true
      },
      reactQuery: {
        enabled: true,
        optionalClient: true,
        version: 'v4',
        mutations: true,
        queryKeys: true,
        queryFactory: true,
      },
      recoil: {
        enabled: false
      },
      messageComposer: {
        enabled: false
      }
    }
  });
  console.log('✨ all done!');
}

async function main() {
  let config = {
    ...DEFAULT_CONFIG,
  };
  const contracts: ContractFile[] = [];
  removeDirectory(CONTRACTS_OUTPUT_DIR)
  for (const root of config.schemaRoots) {
    const schemaDirectories = await getSchemaDirectories(root);
    for (const [dir, name] of schemaDirectories) {
      contracts.push({ name, dir });
    }
  }
  await run(contracts, CONTRACTS_OUTPUT_DIR)
}

main();