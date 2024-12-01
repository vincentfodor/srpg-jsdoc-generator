export const generateTypeDefintionByObjets = (objects) => {
    let definitions = "";

    Object.keys(objects || {}).forEach((key) => {
        const object = objects[key];

        if (key === "Root") {
            // Set root lowercase because API provides it like that
            key = "root";
        }

        if (object.description) {
            definitions += "/**\n" + ` * ${object.description}\n` + " */\n";
        }

        definitions += `const ${key} = {\n`;

        const methodKeys = Object.keys(object.method || {});

        methodKeys.forEach((methodKey, methodIndex) => {
            const method = object.method[methodKey];

            definitions += `\t/**\n`;

            if (method.description) {
                definitions += `\t * ${method.description}\n`;
            }

            (method.parameters || []).forEach((parameter) => {
                definitions += `\t * @param {${parameter.datatype}} ${
                    parameter.name
                } ${parameter.description || ""}\n`;
            });

            if (method.returns?.length) {
                definitions += `\t * @returns {${method.returns[0].datatype}} ${
                    method.returns[0].description || ""
                }\n`;
            }

            definitions +=
                "\t */\n" +
                `\t${methodKey}: function(${(method.parameters || [])
                    .map((v) => v.name)
                    .join(", ")}) {},\n`;

            if (methodIndex !== methodKeys.length - 1) {
                definitions += "\n";
            }
        });

        definitions += "}\n\n";
    });

    return definitions;
};
