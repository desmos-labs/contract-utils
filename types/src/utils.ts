import download from "download";
import AdmZip from "adm-zip";

export class SchemaDownloader {
    repo: string;
    branch: string | undefined;
    tag: string | undefined;
    commit: string | undefined;
    constructor(repo: string, branch?: string, tag?: string, commit?: string) {
        this.repo = repo;
        this.branch = branch;
        this.tag = tag;
        this.commit = commit;
    }
    async download(): Promise<AdmZip> {
        let url;
        if (this.branch !== undefined) {
            url = `${this.repo}/archive/refs/heads/${this.branch}.zip`
        } else if (this.tag !== undefined) {
            url = `${this.repo}/archive/refs/tags/${this.tag}.zip`
        } else if (this.commit !== undefined) {
            url = `${this.repo}/archive/${this.commit}.zip`
        } else {
            // Fallback to master
            url = `${this.repo}/archive/refs/heads/master.zip`;
        }
        return new AdmZip(await download(url));
    }
}