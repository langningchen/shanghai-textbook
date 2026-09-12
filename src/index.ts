import { Server } from "./server.js";
import { intro, log, outro, spinner } from "@clack/prompts";
import { BookProcess } from "./bookProcess.js";
import { RemoteData } from "./remote.js";
import { existsSync, mkdirSync, writeFileSync } from "fs";

intro("Shanghai TextBook Fetcher");
if (!existsSync("./books")) {
  mkdirSync("./books", { recursive: true });
}

const sRemote = spinner();
sRemote.start("Fetching remote repository file tree (main branch)...");
try {
  await RemoteData.init();
  sRemote.stop("Fetched remote repository file tree successfully");
} catch (e) {
  sRemote.stop(`Failed to fetch remote tree: ${(e as Error).message}`);
  log.warn("Will only check local files.");
}

const bookcase = await Server.getBookcase();
writeFileSync("./books/bookcase.json", JSON.stringify(bookcase, null, 2));
for (let i = 0; i < bookcase.length; i++) {
  const book = bookcase[i];
  const s = spinner();
  s.start(`Processing book ${book.title} (${i + 1}/${bookcase.length})`);
  await BookProcess.process(book, s);
  s.stop(`Finished processing book ${book.title}`);
}
log.success("All books processed successfully!");
outro("You can find the books in the ./books directory");
