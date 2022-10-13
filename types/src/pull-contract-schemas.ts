import * as fs from "fs";
import { program } from "commander";
import { SchemaDownloader } from "./utils";

async function main() {

    program.name("Desmos contract schemas downloader")
        .description("Utility script to download the desmos contract json schemas from the github repository")
        .option("--branch <branch>", "branch from from which they will be downloaded")
        .option("--tag <tag>", "git tag from from which they will be downloaded")
        .option("--commit <commit>", "commit id from from which they will be downloaded")
        .action(async ({ branch, tag, commit }) => {
            let schemaPath = "schemas";
            // Clean up or create schemas dir
            if (fs.existsSync(schemaPath)) {
                fs.readdirSync(schemaPath).forEach(dir => {
                    const path = `${schemaPath}/${dir}`;
                    console.log(`Removing ${path}`);
                    fs.rmSync(path, { recursive: true, force: true });
                });
            } else {
                fs.mkdirSync(schemaPath);
            }
            const zip = await new SchemaDownloader("https://github.com/desmos-labs/desmos-contracts", branch, tag, commit).download();
            zip.forEach((f) => {
                if (!f.isDirectory) {
                    const [, , contract, dir, file] = f.entryName.split("/");
                    // Processing a file inside the schema dir of a contract
                    if (dir === "schema" && contract !== "example") {
                        // Create the contract schema dir if not exist.
                        if (!fs.existsSync(`${schemaPath}/${contract}`)) {
                            fs.mkdirSync(`${schemaPath}/${contract}`);
                        }
                        // Write the schema file
                        fs.writeFileSync(`${schemaPath}/${contract}/${file}`, f.getData());
                    }
                }
            });
        });

    program.parse();
}

main();