import { LexerInterpreter, ParserInterpreter, TokenStream, CommonToken, ParserRuleContext, RecognitionException, ANTLRErrorListener, Recognizer, Token, Lexer, RuleContext, CharStream, Parser } from "antlr4ts";
import { ATNState } from "antlr4ts/atn";
import { Symbol } from "antlr4-c3";
import { InterpreterData } from "./InterpreterDataReader";
import { SourceContext } from "./SourceContext";
export interface PredicateEvaluator {
    evaluateLexerPredicate(recognizer: Lexer, ruleIndex: number, actionIndex: number, predicate: string): boolean;
    evaluateParserPredicate(recognizer: Parser, ruleIndex: number, actionIndex: number, predicate: string): boolean;
}
export declare class GrammarLexerInterpreter extends LexerInterpreter {
    private evaluator;
    private mainContext;
    constructor(evaluator: PredicateEvaluator | undefined, mainContext: SourceContext, grammarFileName: string, lexerData: InterpreterData, input: CharStream);
    sempred(_localctx: RuleContext | undefined, ruleIndex: number, predIndex: number): boolean;
    private predicates;
}
export declare class GrammarParserInterpreter extends ParserInterpreter {
    private eventSink;
    private evaluator;
    private mainContext;
    breakPoints: Set<ATNState>;
    callStack: InternalStackFrame[];
    pauseRequested: boolean;
    constructor(eventSink: (event: string | symbol, ...args: any[]) => void, evaluator: PredicateEvaluator | undefined, mainContext: SourceContext, parserData: InterpreterData, input: TokenStream);
    start(startRuleIndex: number): void;
    continue(runMode: RunMode): ParserRuleContext;
    sempred(_localctx: RuleContext | undefined, ruleIndex: number, predIndex: number): boolean;
    action(_localctx: RuleContext | undefined, ruleIndex: number, actionIndex: number): void;
    private ruleNameFromIndex;
    private computeNextSymbols;
    private nextCandidates;
    private candidatesFromBlock;
    private tokenIndexFromName;
    private startIsPrecedenceRule;
    private predicates;
}
export declare enum RunMode {
    Normal = 0,
    StepIn = 1,
    StepOver = 2,
    StepOut = 3
}
export declare class InternalStackFrame {
    name: string;
    source: string;
    current: Symbol[];
    next: Symbol[];
}
export declare class InterpreterLexerErrorListener implements ANTLRErrorListener<number> {
    private eventSink;
    constructor(eventSink: (event: string | symbol, ...args: any[]) => void);
    syntaxError<T extends number>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void;
}
export declare class InterpreterParserErrorListener implements ANTLRErrorListener<CommonToken> {
    private eventSink;
    constructor(eventSink: (event: string | symbol, ...args: any[]) => void);
    syntaxError<T extends Token>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void;
}
