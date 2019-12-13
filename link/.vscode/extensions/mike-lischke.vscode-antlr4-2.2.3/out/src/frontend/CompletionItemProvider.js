'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const facade_1 = require("../backend/facade");
const Symbol_1 = require("./Symbol");
const sortKeys = [
    "01",
    "06",
    "07",
    "03",
    "03",
    "03",
    "03",
    "05",
    "05",
    "02",
    "02",
    "04",
    "08",
    "09",
    "00",
    "10",
];
const details = [
    "Keyword",
    undefined,
    undefined,
    "Built-in lexer token",
    "Virtual lexer token",
    "Fragment lexer token",
    "Lexer token",
    "Built-in lexer mode",
    "Lexer mode",
    "Built-in token channel",
    "Token channel",
    "Parser rule",
    "Action",
    "Predicate",
    "Operator",
    "Grammar option"
];
class AntlrCompletionItemProvider {
    constructor(backend) {
        this.backend = backend;
    }
    provideCompletionItems(document, position, token) {
        let candidates = this.backend.getCodeCompletionCandidates(document.fileName, position.character, position.line + 1);
        let completionList = [];
        candidates.forEach(info => {
            let item = new vscode_1.CompletionItem(info.name, Symbol_1.translateCompletionKind(info.kind));
            item.sortText = sortKeys[info.kind] + info.name;
            item.detail = (info.description != undefined) ? info.description : details[info.kind];
            switch (info.kind) {
                case facade_1.SymbolKind.Keyword:
                    break;
                case facade_1.SymbolKind.TokenVocab:
                    break;
                case facade_1.SymbolKind.Import:
                    break;
                case facade_1.SymbolKind.BuiltInLexerToken:
                    break;
                case facade_1.SymbolKind.VirtualLexerToken:
                    break;
                case facade_1.SymbolKind.FragmentLexerToken:
                    break;
                case facade_1.SymbolKind.LexerToken:
                    break;
                case facade_1.SymbolKind.BuiltInMode:
                    break;
                case facade_1.SymbolKind.LexerMode:
                    break;
                case facade_1.SymbolKind.BuiltInChannel:
                    break;
                case facade_1.SymbolKind.TokenChannel:
                    break;
                case facade_1.SymbolKind.ParserRule:
                    break;
                case facade_1.SymbolKind.Action:
                    break;
                case facade_1.SymbolKind.Predicate:
                    break;
            }
            completionList.push(item);
        });
        return new vscode_1.CompletionList(completionList, false);
    }
    ;
}
exports.AntlrCompletionItemProvider = AntlrCompletionItemProvider;
//# sourceMappingURL=CompletionItemProvider.js.map