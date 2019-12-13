import { ParserRuleContext } from 'antlr4ts';
import { SymbolTable, Symbol, ScopedSymbol, SymbolTableOptions } from "antlr4-c3";
import { SymbolKind, SymbolGroupKind, SymbolInfo } from '../backend/facade';
import { SourceContext } from './SourceContext';
import { ParseTree } from 'antlr4ts/tree';
export declare class ContextSymbolTable extends SymbolTable {
    owner?: SourceContext | undefined;
    tree: ParserRuleContext;
    constructor(name: string, options: SymbolTableOptions, owner?: SourceContext | undefined);
    clear(): void;
    symbolExists(name: string, kind: SymbolKind, localOnly: boolean): boolean;
    symbolExistsInGroup(symbol: string, kind: SymbolGroupKind, localOnly: boolean): boolean;
    contextForSymbol(symbolName: string, kind: SymbolKind, localOnly: boolean): ParseTree | undefined;
    getSymbolInfo(symbol: string | Symbol): SymbolInfo | undefined;
    private symbolsOfType;
    listTopLevelSymbols(localOnly: boolean): SymbolInfo[];
    listActions(): SymbolInfo[];
    getReferenceCount(symbolName: string): number;
    getUnreferencedSymbols(): string[];
    incrementSymbolRefCount(symbolName: string): void;
    getSymbolOccurences(symbolName: string, localOnly: boolean): SymbolInfo[];
    private getSymbolOfType;
    private symbolReferences;
}
export declare class OptionSymbol extends Symbol {
    value: string;
}
export declare class ImportSymbol extends Symbol {
}
export declare class BuiltInTokenSymbol extends Symbol {
}
export declare class VirtualTokenSymbol extends Symbol {
}
export declare class FragmentTokenSymbol extends ScopedSymbol {
}
export declare class TokenSymbol extends ScopedSymbol {
}
export declare class TokenReferenceSymbol extends Symbol {
}
export declare class BuiltInModeSymbol extends Symbol {
}
export declare class LexerModeSymbol extends Symbol {
}
export declare class BuiltInChannelSymbol extends Symbol {
}
export declare class TokenChannelSymbol extends Symbol {
}
export declare class RuleSymbol extends ScopedSymbol {
}
export declare class RuleReferenceSymbol extends Symbol {
}
export declare class AlternativeSymbol extends ScopedSymbol {
}
export declare class EbnfSuffixSymbol extends Symbol {
}
export declare class OptionsSymbol extends ScopedSymbol {
}
export declare class ArgumentSymbol extends ScopedSymbol {
}
export declare class OperatorSymbol extends Symbol {
}
export declare class ActionSymbol extends ScopedSymbol {
    isPredicate: boolean;
}
export declare class PredicateMarkerSymbol extends Symbol {
}
