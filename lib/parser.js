export const getDocumentLinks = (document) => {
    const links = [];

    const sideElement = document.getElementById("side");

    if (!sideElement) {
        console.error("Content element was not found");

        return objects;
    }

    const anchorElements = Array.from(sideElement.querySelectorAll("a"));

    anchorElements.forEach((anchorElement) => {
        let href = anchorElement.getAttribute("href");

        if (!href) {
            return;
        }

        let hrefWithoutHash = href.split("#")[0];

        if (
            !links.includes(hrefWithoutHash) &&
            hrefWithoutHash !== "index.html"
        ) {
            links.push(hrefWithoutHash);
        }
    });

    return links;
};

export const getDocumentObjects = (document) => {
    const objects = {};

    if (!document) {
        console.error("Document was not given");

        return objects;
    }

    const contentElement = document.getElementById("content");

    if (!contentElement) {
        console.error("Content element was not found");

        return objects;
    }

    const scope = {
        name: null,
        index: 0,
        group: null,
        type: null,
        currentPropertyName: null,
    };

    const children = Array.from(contentElement.children);

    children.forEach((child, index) => {
        switch (child.tagName) {
            case "H2":
                scope.name = child.textContent;
                scope.index = 0;
                scope.group = null;
                scope.currentPropertyName = null;
                scope.type = null;

                break;
            case "H3":
                scope.group = child.textContent.toLowerCase();

                objects[scope.name][scope.group] = {};

                scope.index++;

                break;
            case "P":
                let text = child.textContent;

                if (!text) {
                    console.log(
                        `Skipping ${scope.index} at ${scope.name}: Text missing`
                    );

                    scope.index++;

                    return;
                }

                if (scope.index === 0) {
                    objects[scope.name] = {
                        description: text,
                    };

                    scope.index++;

                    return;
                }

                const lowerCasedText = text.toLowerCase();

                switch (lowerCasedText) {
                    case "returns":
                    case "parameters":
                        scope.type = lowerCasedText;

                        if (!scope.currentPropertyName) {
                            console.log(
                                `Skipping ${scope.index} at ${scope.name} in scope ${scope.type}: Current property name missing`
                            );

                            scope.index++;

                            return;
                        }

                        objects[scope.name][scope.group][
                            scope.currentPropertyName
                        ][scope.type] = [];

                        break;
                    default:
                        if (!child.textContent) {
                            console.log(
                                `Skipping ${scope.index} at ${scope.name} in scope ${scope.type}: Property type text missing`
                            );

                            scope.index++;

                            return;
                        }

                        switch (scope.type) {
                            case "returns": {
                                const regex = /\{(\w+)\}\s+(.+)/;

                                const match = child.textContent.match(regex);

                                if (!match) {
                                    console.log(
                                        `Skipping ${scope.index} at ${scope.name} in scope ${scope.type}: Property type text unmatched`
                                    );

                                    scope.index++;

                                    return;
                                }

                                if (!scope.currentPropertyName) {
                                    console.log(
                                        `Skipping ${scope.index} at ${scope.name} in scope ${scope.type}: Current property name missing`
                                    );

                                    scope.index++;

                                    return;
                                }

                                objects[scope.name][scope.group][
                                    scope.currentPropertyName
                                ][scope.type].push({
                                    datatype: match[1],
                                    description: match[2],
                                });

                                break;
                            }
                            case "parameters": {
                                const regex = /\{(\w+)\}\s+(.+)/;

                                const match = child.textContent.match(regex);

                                if (!match) {
                                    console.log(
                                        `Skipping ${scope.index} at ${scope.name} in scope ${scope.type}: Property type text unmatched`
                                    );

                                    scope.index++;

                                    return;
                                }

                                if (!scope.currentPropertyName) {
                                    console.log(
                                        `Skipping ${scope.index} at ${scope.name} in scope ${scope.type}: Current property name missing`
                                    );

                                    scope.index++;

                                    return;
                                }

                                let parameterDescriptionSplit =
                                    match[2].split(" ");
                                let parameterName =
                                    parameterDescriptionSplit[0];

                                parameterDescriptionSplit =
                                    parameterDescriptionSplit.slice(0, 1);

                                objects[scope.name][scope.group][
                                    scope.currentPropertyName
                                ][scope.type].push({
                                    datatype: match[1],
                                    description:
                                        parameterDescriptionSplit.join(" "),
                                    name: parameterName.replace(/[\]\*]/g, ""),
                                });

                                break;
                            }
                            case null: {
                                let propertyText =
                                    children[index + 1].textContent ||
                                    children[index + 2].textContent;

                                if (!propertyText) {
                                    console.log(
                                        `Skipping ${scope.index} at ${scope.name}: Property text missing`
                                    );

                                    scope.type = null;
                                    scope.index++;

                                    return;
                                }

                                let regex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;

                                let match = propertyText.match(regex);

                                if (!match) {
                                    console.log(
                                        `Skipping ${scope.index} at ${scope.name}: Property text unmatched`
                                    );

                                    scope.type = null;
                                    scope.index++;

                                    return;
                                }

                                let propertyName = match[1];

                                objects[scope.name][scope.group][propertyName] =
                                    {
                                        description: child.textContent,
                                    };

                                scope.currentPropertyName = propertyName;
                                scope.index++;

                                return;
                            }
                        }
                }

                scope.index++;

                break;
            case "HR":
                scope.type = null;
                scope.currentPropertyName = null;
                scope.index++;

                break;
            default:
                scope.index++;
        }
    });

    return objects;
};
