import { SymbolGroupKind, DiagnosticEntry } from './facade';
import { ContextSymbolTable } from './ContextSymbolTable';
import { ANTLRv4ParserListener } from '../parser/ANTLRv4ParserListener';
import { TerminalRuleContext, RulerefContext, SetElementContext, LexerCommandContext, LexerRuleSpecContext, ParserRuleSpecContext } from '../parser/ANTLRv4Parser';
import { Token } from 'antlr4ts';
export declare class SemanticListener implements ANTLRv4ParserListener {
    private diagnostics;
    private symbolTable;
    constructor(diagnostics: DiagnosticEntry[], symbolTable: ContextSymbolTable);
    exitTerminalRule: (ctx: TerminalRuleContext) => void;
    exitRuleref: (ctx: RulerefContext) => void;
    exitSetElement: (ctx: SetElementContext) => void;
    exitLexerCommand: (ctx: LexerCommandContext) => void;
    exitLexerRuleSpec: (ctx: LexerRuleSpecContext) => void;
    exitParserRuleSpec: (ctx: ParserRuleSpecContext) => void;
    protected checkSymbolExistance(mustExist: boolean, kind: SymbolGroupKind, symbol: string, message: string, offendingToken: Token): void;
    protected reportDuplicateSymbol(symbol: string, offendingToken: Token, previousToken: Token | undefined): void;
    private seenSymbols;
}
