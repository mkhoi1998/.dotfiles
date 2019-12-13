/// <reference types="node" />
import { EventEmitter } from "events";
import { CommonToken, Token, Lexer, Parser } from "antlr4ts";
import { ParseTreeNode, LexicalRange } from "./facade";
import { SourceContext } from "./SourceContext";
import { PredicateEvaluator } from "./GrammarInterpreters";
export interface GrammarBreakPoint {
    source: string;
    validated: boolean;
    line: number;
    id: number;
}
export interface GrammarStackFrame {
    name: string;
    source: string;
    next: LexicalRange[];
}
export declare class GrammarDebugger extends EventEmitter {
    private contexts;
    constructor(contexts: SourceContext[], actionFile: string);
    readonly isValid: boolean;
    start(startRuleIndex: number, input: string, noDebug: boolean): Promise<void>;
    continue(): void;
    stepIn(): void;
    stepOut(): void;
    stepOver(): void;
    stop(): void;
    pause(): void;
    clearBreakPoints(): void;
    addBreakPoint(path: string, line: number): GrammarBreakPoint;
    readonly tokenList: Token[];
    readonly errorCount: number;
    readonly inputSize: number;
    ruleNameFromIndex(ruleIndex: number): string | undefined;
    ruleIndexFromName(ruleName: string): number;
    readonly currentParseTree: ParseTreeNode | undefined;
    readonly currentStackTrace: GrammarStackFrame[];
    readonly currentTokenIndex: number;
    getStackInfo(index: number): string;
    getVariables(index: number): [string, string][];
    tokenTypeName(token: CommonToken): string;
    private sendEvent;
    private parseContextToNode;
    private computeHash;
    private convertToken;
    private validateBreakPoint;
    private lexerData;
    private parserData;
    private lexer;
    private tokenStream;
    private parser;
    private parseTree;
    private breakPoints;
    private nextBreakPointId;
    predicateEvaluator?: PredicateEvaluator;
    evaluateLexerPredicate?: (lexer: Lexer, ruleIndex: number, actionIndex: number, predicate: string) => boolean;
    evaluateParserPredicate?: (parser: Parser, ruleIndex: number, actionIndex: number, predicate: string) => boolean;
}
