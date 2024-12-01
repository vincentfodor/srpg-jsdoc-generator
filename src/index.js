import { generateTypeDefintionByObjets } from "../lib/generator";
import { getDocumentLinks, getDocumentObjects } from "../lib/parser";
import { scrapeDocument } from "../lib/scraper";
import fs from "fs/promises";
import { Promise } from "bluebird";

export const baseUrl = "https://srpgstudio.com/english/api";

const targetFile = "./type-definitions.js";

const main = async () => {
    const rootDocument = await scrapeDocument(`${baseUrl}/index.html`);

    if (!rootDocument) {
        console.error(`Failed to fetch root document: ${response.statusText}`);

        return;
    }

    const links = getDocumentLinks(rootDocument);

    const rootObjects = getDocumentObjects(rootDocument);

    const objectsArray = [rootObjects];

    await Promise.map(links, async (link, index) => {
        console.log(
            `[${links.length - index}/${links.length}] Scraping ${link}...`
        );

        const document = await scrapeDocument(`${baseUrl}/${link}`);

        if (!document) {
            console.error(`Failed to fetch ${link}: ${response.statusText}`);

            return;
        }

        objectsArray.push(getDocumentObjects(document));
    });

    try {
        console.time("File write");

        let definitions = "";

        objectsArray.forEach((objects) => {
            definitions += generateTypeDefintionByObjets(objects);
        });

        await fs.writeFile(targetFile, definitions);

        console.timeEnd("File write");
    } catch (err) {
        console.error(err);
    }
};

main();
