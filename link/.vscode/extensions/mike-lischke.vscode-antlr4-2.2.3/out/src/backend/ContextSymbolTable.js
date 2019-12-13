"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const antlr4_c3_1 = require("antlr4-c3");
const facade_1 = require("../backend/facade");
const SourceContext_1 = require("./SourceContext");
const _ = require('lodash');
class ContextSymbolTable extends antlr4_c3_1.SymbolTable {
    constructor(name, options, owner) {
        super(name, options);
        this.owner = owner;
        this.symbolReferences = new Map();
    }
    ;
    clear() {
        if (this.owner) {
            for (let dep of this.dependencies) {
                if (dep.owner) {
                    this.owner.removeDependency(dep.owner);
                }
            }
        }
        this.symbolReferences.clear();
        super.clear();
    }
    symbolExists(name, kind, localOnly) {
        return this.getSymbolOfType(name, kind, localOnly) != undefined;
    }
    symbolExistsInGroup(symbol, kind, localOnly) {
        switch (kind) {
            case facade_1.SymbolGroupKind.TokenRef:
                if (this.symbolExists(symbol, facade_1.SymbolKind.BuiltInLexerToken, localOnly))
                    return true;
                if (this.symbolExists(symbol, facade_1.SymbolKind.VirtualLexerToken, localOnly))
                    return true;
                if (this.symbolExists(symbol, facade_1.SymbolKind.FragmentLexerToken, localOnly))
                    return true;
                if (this.symbolExists(symbol, facade_1.SymbolKind.LexerToken, localOnly))
                    return true;
                break;
            case facade_1.SymbolGroupKind.LexerMode:
                if (this.symbolExists(symbol, facade_1.SymbolKind.BuiltInMode, localOnly))
                    return true;
                if (this.symbolExists(symbol, facade_1.SymbolKind.LexerMode, localOnly))
                    return true;
                break;
            case facade_1.SymbolGroupKind.TokenChannel:
                if (this.symbolExists(symbol, facade_1.SymbolKind.BuiltInChannel, localOnly))
                    return true;
                if (this.symbolExists(symbol, facade_1.SymbolKind.TokenChannel, localOnly))
                    return true;
                break;
            case facade_1.SymbolGroupKind.RuleRef:
                if (this.symbolExists(symbol, facade_1.SymbolKind.ParserRule, localOnly))
                    return true;
                break;
        }
        return false;
    }
    contextForSymbol(symbolName, kind, localOnly) {
        let symbol = this.getSymbolOfType(symbolName, kind, localOnly);
        if (!symbol) {
            return undefined;
        }
        return symbol.context;
    }
    getSymbolInfo(symbol) {
        if (!(symbol instanceof antlr4_c3_1.Symbol)) {
            let temp = this.resolve(symbol);
            if (!temp) {
                return undefined;
            }
            symbol = temp;
        }
        let kind = SourceContext_1.SourceContext.getKindFromSymbol(symbol);
        let name = symbol.name;
        if (kind == facade_1.SymbolKind.TokenVocab || kind == facade_1.SymbolKind.Import) {
            this.dependencies.forEach((table) => {
                if (table.owner && table.owner.sourceId.includes(name)) {
                    return {
                        kind: kind,
                        name: name,
                        source: table.owner.fileName,
                        definition: SourceContext_1.SourceContext.definitionForContext(table.tree, true)
                    };
                }
            });
        }
        let symbolTable = symbol.symbolTable;
        return {
            kind: kind,
            name: name,
            source: (symbol.context && symbolTable && symbolTable.owner) ? symbolTable.owner.fileName : "ANTLR runtime",
            definition: SourceContext_1.SourceContext.definitionForContext(symbol.context, true),
            description: undefined
        };
    }
    symbolsOfType(t, localOnly = false) {
        var result = [];
        let symbols = this.getAllSymbols(t, localOnly);
        for (let symbol of symbols) {
            let root = symbol.root;
            result.push({
                kind: SourceContext_1.SourceContext.getKindFromSymbol(symbol),
                name: symbol.name,
                source: root.owner ? root.owner.fileName : "ANTLR runtime",
                definition: SourceContext_1.SourceContext.definitionForContext(symbol.context, true),
                description: undefined
            });
        }
        return result;
    }
    listTopLevelSymbols(localOnly) {
        let result = [];
        let options = this.resolve("options", true);
        if (options) {
            let tokenVocab = options.resolve("tokenVocab", true);
            if (tokenVocab) {
                result.push(this.getSymbolInfo(tokenVocab));
            }
        }
        result.push(...this.symbolsOfType(ImportSymbol, localOnly));
        result.push(...this.symbolsOfType(BuiltInTokenSymbol, localOnly));
        result.push(...this.symbolsOfType(VirtualTokenSymbol, localOnly));
        result.push(...this.symbolsOfType(FragmentTokenSymbol, localOnly));
        result.push(...this.symbolsOfType(TokenSymbol, localOnly));
        result.push(...this.symbolsOfType(BuiltInModeSymbol, localOnly));
        result.push(...this.symbolsOfType(LexerModeSymbol, localOnly));
        result.push(...this.symbolsOfType(BuiltInChannelSymbol, localOnly));
        result.push(...this.symbolsOfType(TokenChannelSymbol, localOnly));
        result.push(...this.symbolsOfType(RuleSymbol, localOnly));
        return result;
    }
    listActions() {
        let result = [];
        let actions = this.getNestedSymbolsOfType(ActionSymbol);
        for (let action of actions) {
            let definition = SourceContext_1.SourceContext.definitionForContext(action.context, true);
            if (action.isPredicate) {
                let questionMark = action.nextSibling;
                if (questionMark) {
                    let context = questionMark.context;
                    definition.range.end.row = context.symbol.line;
                    definition.range.end.column = context.symbol.charPositionInLine;
                }
            }
            result.push({
                kind: SourceContext_1.SourceContext.getKindFromSymbol(action),
                name: action.name,
                source: this.owner ? this.owner.fileName : "",
                definition: definition,
                isPredicate: action.isPredicate,
                description: action.context.text
            });
        }
        return result;
    }
    getReferenceCount(symbolName) {
        let reference = this.symbolReferences.get(symbolName);
        if (reference) {
            return reference;
        }
        else {
            return 0;
        }
    }
    getUnreferencedSymbols() {
        let result = [];
        for (let entry of this.symbolReferences) {
            if (entry[1] == 0) {
                result.push(entry[0]);
            }
        }
        return result;
    }
    incrementSymbolRefCount(symbolName) {
        let reference = this.symbolReferences.get(symbolName);
        if (reference) {
            this.symbolReferences.set(symbolName, reference + 1);
        }
        else {
            this.symbolReferences.set(symbolName, 1);
        }
    }
    getSymbolOccurences(symbolName, localOnly) {
        let result = [];
        let symbols = this.getAllSymbols(antlr4_c3_1.Symbol, localOnly);
        for (let symbol of symbols) {
            let owner = symbol.root.owner;
            if (owner) {
                if (symbol.context && symbol.name == symbolName) {
                    let context = symbol.context;
                    if (symbol instanceof FragmentTokenSymbol) {
                        context = symbol.context.children[1];
                    }
                    else if (symbol instanceof TokenSymbol || symbol instanceof RuleSymbol) {
                        context = symbol.context.children[0];
                    }
                    result.push({
                        kind: SourceContext_1.SourceContext.getKindFromSymbol(symbol),
                        name: symbolName,
                        source: owner.fileName,
                        definition: SourceContext_1.SourceContext.definitionForContext(context, true),
                        description: undefined
                    });
                }
                if (symbol instanceof antlr4_c3_1.ScopedSymbol) {
                    let references = symbol.getAllNestedSymbols(symbolName);
                    for (let reference of references) {
                        result.push({
                            kind: SourceContext_1.SourceContext.getKindFromSymbol(reference),
                            name: symbolName,
                            source: owner.fileName,
                            definition: SourceContext_1.SourceContext.definitionForContext(reference.context, true),
                            description: undefined
                        });
                    }
                }
            }
        }
        return result;
    }
    getSymbolOfType(name, kind, localOnly) {
        switch (kind) {
            case facade_1.SymbolKind.TokenVocab: {
                let options = this.resolve("options", true);
                if (options) {
                    return options.resolve(name, localOnly);
                }
            }
            case facade_1.SymbolKind.Import:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.BuiltInLexerToken:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.VirtualLexerToken:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.FragmentLexerToken:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.LexerToken:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.BuiltInMode:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.LexerMode:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.BuiltInChannel:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.TokenChannel:
                return this.resolve(name, localOnly);
            case facade_1.SymbolKind.ParserRule:
                return this.resolve(name, localOnly);
        }
        return undefined;
    }
}
exports.ContextSymbolTable = ContextSymbolTable;
;
class OptionSymbol extends antlr4_c3_1.Symbol {
}
exports.OptionSymbol = OptionSymbol;
class ImportSymbol extends antlr4_c3_1.Symbol {
}
exports.ImportSymbol = ImportSymbol;
class BuiltInTokenSymbol extends antlr4_c3_1.Symbol {
}
exports.BuiltInTokenSymbol = BuiltInTokenSymbol;
class VirtualTokenSymbol extends antlr4_c3_1.Symbol {
}
exports.VirtualTokenSymbol = VirtualTokenSymbol;
class FragmentTokenSymbol extends antlr4_c3_1.ScopedSymbol {
}
exports.FragmentTokenSymbol = FragmentTokenSymbol;
class TokenSymbol extends antlr4_c3_1.ScopedSymbol {
}
exports.TokenSymbol = TokenSymbol;
class TokenReferenceSymbol extends antlr4_c3_1.Symbol {
}
exports.TokenReferenceSymbol = TokenReferenceSymbol;
class BuiltInModeSymbol extends antlr4_c3_1.Symbol {
}
exports.BuiltInModeSymbol = BuiltInModeSymbol;
class LexerModeSymbol extends antlr4_c3_1.Symbol {
}
exports.LexerModeSymbol = LexerModeSymbol;
class BuiltInChannelSymbol extends antlr4_c3_1.Symbol {
}
exports.BuiltInChannelSymbol = BuiltInChannelSymbol;
class TokenChannelSymbol extends antlr4_c3_1.Symbol {
}
exports.TokenChannelSymbol = TokenChannelSymbol;
class RuleSymbol extends antlr4_c3_1.ScopedSymbol {
}
exports.RuleSymbol = RuleSymbol;
class RuleReferenceSymbol extends antlr4_c3_1.Symbol {
}
exports.RuleReferenceSymbol = RuleReferenceSymbol;
class AlternativeSymbol extends antlr4_c3_1.ScopedSymbol {
}
exports.AlternativeSymbol = AlternativeSymbol;
class EbnfSuffixSymbol extends antlr4_c3_1.Symbol {
}
exports.EbnfSuffixSymbol = EbnfSuffixSymbol;
class OptionsSymbol extends antlr4_c3_1.ScopedSymbol {
}
exports.OptionsSymbol = OptionsSymbol;
class ArgumentSymbol extends antlr4_c3_1.ScopedSymbol {
}
exports.ArgumentSymbol = ArgumentSymbol;
class OperatorSymbol extends antlr4_c3_1.Symbol {
}
exports.OperatorSymbol = OperatorSymbol;
class ActionSymbol extends antlr4_c3_1.ScopedSymbol {
    constructor() {
        super(...arguments);
        this.isPredicate = false;
    }
}
exports.ActionSymbol = ActionSymbol;
class PredicateMarkerSymbol extends antlr4_c3_1.Symbol {
}
exports.PredicateMarkerSymbol = PredicateMarkerSymbol;
//# sourceMappingURL=ContextSymbolTable.js.map