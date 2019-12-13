"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facade_1 = require("./facade");
const antlr4ts_1 = require("antlr4ts");
const tree_1 = require("antlr4ts/tree");
class SemanticListener {
    constructor(diagnostics, symbolTable) {
        this.diagnostics = diagnostics;
        this.symbolTable = symbolTable;
        this.exitTerminalRule = function (ctx) {
            let tokenRef = ctx.TOKEN_REF();
            if (tokenRef) {
                let symbol = tokenRef.text;
                this.checkSymbolExistance(true, facade_1.SymbolGroupKind.TokenRef, symbol, "Unknown token reference", tokenRef.symbol);
                this.symbolTable.incrementSymbolRefCount(symbol);
            }
        };
        this.exitRuleref = function (ctx) {
            let ruleRef = ctx.RULE_REF();
            if (ruleRef) {
                let symbol = ruleRef.text;
                this.checkSymbolExistance(true, facade_1.SymbolGroupKind.RuleRef, symbol, "Unknown parser rule", ruleRef.symbol);
                this.symbolTable.incrementSymbolRefCount(symbol);
            }
        };
        this.exitSetElement = function (ctx) {
            let tokenRef = ctx.TOKEN_REF();
            if (tokenRef) {
                let symbol = tokenRef.text;
                this.checkSymbolExistance(true, facade_1.SymbolGroupKind.TokenRef, symbol, "Unknown token reference", tokenRef.symbol);
                this.symbolTable.incrementSymbolRefCount(symbol);
            }
        };
        this.exitLexerCommand = function (ctx) {
            let lexerCommandExpr = ctx.lexerCommandExpr();
            let lexerCommandExprId = lexerCommandExpr ? lexerCommandExpr.identifier() : undefined;
            if (lexerCommandExprId) {
                let name = ctx.lexerCommandName().text;
                let kind = facade_1.SymbolGroupKind.TokenRef;
                let value = name.toLowerCase();
                if (value == "pushmode" || value == "mode") {
                    name = "mode";
                    kind = facade_1.SymbolGroupKind.LexerMode;
                }
                else if (value == "channel") {
                    kind = facade_1.SymbolGroupKind.TokenChannel;
                }
                let symbol = lexerCommandExprId.text;
                this.checkSymbolExistance(true, kind, symbol, "Unknown " + name, lexerCommandExprId.start);
                this.symbolTable.incrementSymbolRefCount(symbol);
            }
        };
        this.exitLexerRuleSpec = function (ctx) {
            let tokenRef = ctx.TOKEN_REF();
            let name = tokenRef.text;
            let seenSymbol = this.seenSymbols.get(name);
            if (seenSymbol) {
                this.reportDuplicateSymbol(name, tokenRef.symbol, seenSymbol);
            }
            else {
                let symbol = this.symbolTable.resolve(name);
                if (symbol.root != this.symbolTable) {
                    let start = symbol.context instanceof antlr4ts_1.ParserRuleContext ?
                        symbol.context.start : symbol.context.symbol;
                    this.reportDuplicateSymbol(name, tokenRef.symbol, symbol.context ? start : undefined);
                }
                else {
                    this.seenSymbols.set(name, tokenRef.symbol);
                }
            }
        };
        this.exitParserRuleSpec = function (ctx) {
            let ruleRef = ctx.RULE_REF();
            let name = ruleRef.text;
            let seenSymbol = this.seenSymbols.get(name);
            if (seenSymbol) {
                this.reportDuplicateSymbol(name, ruleRef.symbol, seenSymbol);
            }
            else {
                let symbol = this.symbolTable.resolve(name);
                if (symbol.root != this.symbolTable) {
                    let start;
                    if (symbol.context instanceof antlr4ts_1.ParserRuleContext) {
                        start = symbol.context.start;
                    }
                    else if (symbol.context instanceof tree_1.TerminalNode) {
                        start = symbol.context.symbol;
                    }
                    this.reportDuplicateSymbol(name, ruleRef.symbol, start);
                }
                else {
                    this.seenSymbols.set(name, ruleRef.symbol);
                }
            }
        };
        this.seenSymbols = new Map();
    }
    checkSymbolExistance(mustExist, kind, symbol, message, offendingToken) {
        if (this.symbolTable.symbolExistsInGroup(symbol, kind, false) != mustExist) {
            let entry = {
                type: facade_1.DiagnosticType.Error,
                message: message + " '" + symbol + "'",
                range: {
                    start: {
                        column: offendingToken.charPositionInLine,
                        row: offendingToken.line
                    },
                    end: {
                        column: offendingToken.charPositionInLine + offendingToken.stopIndex - offendingToken.startIndex + 1,
                        row: offendingToken.line
                    }
                }
            };
            this.diagnostics.push(entry);
        }
    }
    reportDuplicateSymbol(symbol, offendingToken, previousToken) {
        let entry = {
            type: facade_1.DiagnosticType.Error,
            message: "Duplicate symbol '" + symbol + "'",
            range: {
                start: {
                    column: offendingToken.charPositionInLine,
                    row: offendingToken.line
                },
                end: {
                    column: offendingToken.charPositionInLine + offendingToken.stopIndex - offendingToken.startIndex + 1,
                    row: offendingToken.line
                }
            }
        };
        this.diagnostics.push(entry);
    }
}
exports.SemanticListener = SemanticListener;
//# sourceMappingURL=SemanticListener.js.map