export class RemoteData {
    private static readonly OWNER = "langningchen";
    private static readonly REPO = "shanghai-textbook-data";
    private static readonly BRANCH = "main";

    private static remoteFiles: Set<string> | null = null;

    static async init(): Promise<void> {
        if (this.remoteFiles) return;

        this.remoteFiles = new Set<string>();

        const url = `https://api.github.com/repos/${this.OWNER}/${this.REPO}/git/trees/${this.BRANCH}?recursive=1`;
        const headers: Record<string, string> = {
            "User-Agent": "shanghai-textbook-crawler",
            Accept: "application/vnd.github.v3+json",
        };

        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) {
            throw new Error(
                `Failed to fetch remote tree from ${this.BRANCH}: ${res.status} ${res.statusText}`
            );
        }

        const data = await res.json();
        if (data.tree && Array.isArray(data.tree)) {
            for (const item of data.tree) {
                if (typeof item.path === "string") {
                    this.remoteFiles.add(item.path);
                }
            }
        }
    }

    static hasFile(filePath: string): boolean {
        const normalized = filePath.replace(/^\.\//, "");
        return this.remoteFiles ? this.remoteFiles.has(normalized) : false;
    }

    static isBookComplete(uuid: string): boolean {
        const jsonExists = this.hasFile(`books/${uuid}.json`);
        const pdfExists = this.hasFile(`books/${uuid}.pdf`);
        const pdfPartExists = this.hasFile(`books/${uuid}.pdf.1`);
        const jpgExists = this.hasFile(`books/${uuid}.jpg`);
        const pngExists = this.hasFile(`books/${uuid}.png`);

        return (
            jsonExists &&
            (pdfExists || pdfPartExists) &&
            (jpgExists || pngExists)
        );
    }
}
