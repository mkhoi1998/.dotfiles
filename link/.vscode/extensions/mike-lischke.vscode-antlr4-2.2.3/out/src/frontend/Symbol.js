'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const facade_1 = require("../backend/facade");
function symbolDescriptionFromEnum(kind) {
    switch (kind) {
        case facade_1.SymbolKind.LexerToken:
            return "Lexer Token";
        case facade_1.SymbolKind.VirtualLexerToken:
            return "Virtual Lexer Token";
        case facade_1.SymbolKind.FragmentLexerToken:
            return "Fragment Lexer Token";
        case facade_1.SymbolKind.BuiltInLexerToken:
            return "Predefined Lexer Token";
        case facade_1.SymbolKind.ParserRule:
            return "Parser Rule";
        case facade_1.SymbolKind.LexerMode:
            return "Lexer Mode";
        case facade_1.SymbolKind.BuiltInMode:
            return "Predefined Lexer Mode";
        case facade_1.SymbolKind.TokenChannel:
            return "Token Channel";
        case facade_1.SymbolKind.BuiltInChannel:
            return "Predefined Token Channel";
        case facade_1.SymbolKind.Import:
            return "Grammar Import";
        case facade_1.SymbolKind.TokenVocab:
            return "Token Vocabulary";
        default:
            return "Unknown type";
    }
}
exports.symbolDescriptionFromEnum = symbolDescriptionFromEnum;
function translateSymbolKind(kind) {
    switch (kind) {
        case facade_1.SymbolKind.LexerToken:
            return vscode.SymbolKind.Function;
        case facade_1.SymbolKind.VirtualLexerToken:
            return vscode.SymbolKind.Enum;
        case facade_1.SymbolKind.FragmentLexerToken:
            return vscode.SymbolKind.Function;
        case facade_1.SymbolKind.BuiltInLexerToken:
            return vscode.SymbolKind.Property;
        case facade_1.SymbolKind.ParserRule:
            return vscode.SymbolKind.Method;
        case facade_1.SymbolKind.LexerMode:
            return vscode.SymbolKind.Variable;
        case facade_1.SymbolKind.BuiltInMode:
            return vscode.SymbolKind.Variable;
        case facade_1.SymbolKind.TokenChannel:
            return vscode.SymbolKind.Variable;
        case facade_1.SymbolKind.BuiltInChannel:
            return vscode.SymbolKind.Variable;
        case facade_1.SymbolKind.Import:
            return vscode.SymbolKind.Module;
        case facade_1.SymbolKind.TokenVocab:
            return vscode.SymbolKind.Module;
        default:
            return vscode.SymbolKind.Null;
    }
}
exports.translateSymbolKind = translateSymbolKind;
function translateCompletionKind(kind) {
    switch (kind) {
        case facade_1.SymbolKind.Keyword:
            return vscode.CompletionItemKind.Keyword;
        case facade_1.SymbolKind.LexerToken:
            return vscode.CompletionItemKind.Text;
        case facade_1.SymbolKind.VirtualLexerToken:
            return vscode.CompletionItemKind.Text;
        case facade_1.SymbolKind.FragmentLexerToken:
            return vscode.CompletionItemKind.Text;
        case facade_1.SymbolKind.BuiltInLexerToken:
            return vscode.CompletionItemKind.Constant;
        case facade_1.SymbolKind.ParserRule:
            return vscode.CompletionItemKind.Method;
        case facade_1.SymbolKind.LexerMode:
            return vscode.CompletionItemKind.Enum;
        case facade_1.SymbolKind.BuiltInMode:
            return vscode.CompletionItemKind.Constant;
        case facade_1.SymbolKind.TokenChannel:
            return vscode.CompletionItemKind.Property;
        case facade_1.SymbolKind.BuiltInChannel:
            return vscode.CompletionItemKind.Constant;
        case facade_1.SymbolKind.Import:
            return vscode.CompletionItemKind.Module;
        case facade_1.SymbolKind.TokenVocab:
            return vscode.CompletionItemKind.Module;
        case facade_1.SymbolKind.Action:
        case facade_1.SymbolKind.Predicate:
            return vscode.CompletionItemKind.Snippet;
        default:
            return vscode.CompletionItemKind.Text;
    }
}
exports.translateCompletionKind = translateCompletionKind;
//# sourceMappingURL=Symbol.js.map