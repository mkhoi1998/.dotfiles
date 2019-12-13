"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class AntlrFormattingProvider {
    constructor(backend) {
        this.backend = backend;
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        let start = document.offsetAt(range.start);
        let end = document.offsetAt(range.end) - 1;
        let formatOptions = vscode_1.workspace.getConfiguration("antlr4.format");
        let text = "";
        [text, start, end] = this.backend.formatGrammar(document.fileName, Object.assign({}, formatOptions), start, end);
        let resultRange = range.with(document.positionAt(start), document.positionAt(end + 1));
        return [vscode_1.TextEdit.replace(resultRange, text)];
    }
}
exports.AntlrFormattingProvider = AntlrFormattingProvider;
;
//# sourceMappingURL=FormattingProvider.js.map