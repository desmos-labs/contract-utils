import * as fs from "fs";
import download from "download";
import AdmZip from "adm-zip";
import { program } from "commander";


async function main() {

    program.name("Desmos contract schemas downloader")
        .description("Utility script to download the desmos contract json schemas from the github repository")
        .option("--branch <branch>", "branch from from which they will be downloaded")
        .option("--tag <tag>", "git tag from from which they will be downloaded")
        .option("--commit <commit>", "commit id from from which they will be downloaded")
        .action(async ({branch, tag, commit}) => {
            let url;
            if (branch !== undefined) {
                url = `https://github.com/desmos-labs/desmos-contracts/archive/refs/heads/${branch}.zip`
            } else if (tag !== undefined) {
                url = `https://github.com/desmos-labs/desmos-contracts/archive/refs/tags/${tag}.zip`
            } else if (commit !== undefined) {
                url = `https://github.com/desmos-labs/desmos-contracts/archive/${commit}.zip`
            } else {
                // Fallback to master
                url = `https://github.com/desmos-labs/desmos-contracts/archive/refs/heads/master.zip`;
            }

            console.log("Downloading archive from", url);
            const zip = new AdmZip(await download(url));

            zip.forEach((f) => {
                if (!f.isDirectory) {
                    const [, , contract, dir, file] = f.entryName.split("/");
                    // Processing a file inside the schema dir of a contract
                    if (dir === "schema" && contract !== "example") {
                        // Create the contract schema dir if not exist.
                        if (!fs.existsSync(`schemas/${contract}`)) {
                            fs.mkdirSync(`schemas/${contract}`);
                        }
                        // Write the schema file
                        fs.writeFileSync(`schemas/${contract}/${file}`, f.getData());
                    }
                }
            });
        });

    program.parse();
}

main();