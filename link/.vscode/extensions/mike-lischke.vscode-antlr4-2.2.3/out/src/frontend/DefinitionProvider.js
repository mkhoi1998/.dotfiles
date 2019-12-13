'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class AntlrDefinitionProvider {
    constructor(backend) {
        this.backend = backend;
    }
    provideDefinition(document, position, token) {
        let info = this.backend.symbolInfoAtPosition(document.fileName, position.character, position.line + 1, true);
        if (!info) {
            return undefined;
        }
        if (info.definition) {
            let range = new vscode_1.Range(info.definition.range.start.row - 1, info.definition.range.start.column, info.definition.range.end.row - 1, info.definition.range.end.column);
            return new vscode_1.Location(vscode_1.Uri.file(info.source), range);
        }
        else {
            let position = new vscode_1.Position(0, 0);
            return new vscode_1.Location(vscode_1.Uri.parse(""), position);
        }
    }
    ;
}
exports.AntlrDefinitionProvider = AntlrDefinitionProvider;
;
//# sourceMappingURL=DefinitionProvider.js.map