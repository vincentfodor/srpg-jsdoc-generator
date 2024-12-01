import jsdom from "jsdom";

export const scrapeDocument = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        console.error(`Failed to fetch page: ${response.statusText}`);

        return;
    }

    const responseText = await response.text();

    const dom = new jsdom.JSDOM(responseText, {
        runScripts: "dangerously",
        resources: "usable",
    });

    const document = dom?.window?.document;

    return document;
};
