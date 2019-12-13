'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Symbol_1 = require("./Symbol");
const path = require("path");
class AntlrHoverProvider {
    constructor(backend) {
        this.backend = backend;
    }
    provideHover(document, position, token) {
        let info = this.backend.symbolInfoAtPosition(document.fileName, position.character, position.line + 1, true);
        if (!info) {
            return undefined;
        }
        const description = Symbol_1.symbolDescriptionFromEnum(info.kind);
        return new vscode_1.Hover([
            "**" + description + "**\ndefined in: " + path.basename(info.source),
            { language: "antlr", value: (info.definition ? info.definition.text : "") }
        ]);
    }
    ;
}
exports.AntlrHoverProvider = AntlrHoverProvider;
//# sourceMappingURL=HoverProvider.js.map