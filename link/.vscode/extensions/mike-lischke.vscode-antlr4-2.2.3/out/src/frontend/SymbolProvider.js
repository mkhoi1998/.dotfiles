'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
const facade_1 = require("../backend/facade");
const Symbol_1 = require("./Symbol");
class AntlrSymbolProvider {
    constructor(backend) {
        this.backend = backend;
    }
    provideDocumentSymbols(document, token) {
        var symbols = this.backend.listTopLevelSymbols(document.fileName, false);
        let basePath = path.dirname(document.fileName);
        var symbolsList = [];
        for (let symbol of symbols) {
            if (!symbol.definition) {
                continue;
            }
            let startRow = symbol.definition.range.start.row > 0 ? symbol.definition.range.start.row - 1 : 0;
            let endRow = symbol.definition.range.end.row > 0 ? symbol.definition.range.end.row - 1 : 0;
            let range = new vscode_1.Range(startRow, symbol.definition.range.start.column, endRow, symbol.definition.range.end.column);
            let location = new vscode_1.Location(vscode_1.Uri.file(symbol.source), range);
            var description = Symbol_1.symbolDescriptionFromEnum(symbol.kind);
            const kind = Symbol_1.translateSymbolKind(symbol.kind);
            let totalTextLength = symbol.name.length + description.length + 1;
            if (symbol.kind == facade_1.SymbolKind.LexerMode && totalTextLength < 80) {
                var markerWidth = 80 - totalTextLength;
                description += " " + "-".repeat(markerWidth);
            }
            let info = new vscode_1.SymbolInformation(symbol.name, kind, description, location);
            symbolsList.push(info);
        }
        return symbolsList;
    }
    ;
}
exports.AntlrSymbolProvider = AntlrSymbolProvider;
;
//# sourceMappingURL=SymbolProvider.js.map