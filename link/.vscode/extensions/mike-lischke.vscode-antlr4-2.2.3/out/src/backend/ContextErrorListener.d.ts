import { ANTLRErrorListener, Recognizer, RecognitionException, Token, CommonToken } from 'antlr4ts';
import { DiagnosticEntry } from '../backend/facade';
export declare class ContextLexerErrorListener implements ANTLRErrorListener<number> {
    private errorList;
    constructor(errorList: DiagnosticEntry[]);
    syntaxError<T extends number>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void;
}
export declare class ContextErrorListener implements ANTLRErrorListener<CommonToken> {
    private errorList;
    constructor(errorList: DiagnosticEntry[]);
    syntaxError<T extends Token>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void;
}
