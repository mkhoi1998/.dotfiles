import { Lexer } from 'antlr4ts';
import { Token } from 'antlr4ts';
export declare abstract class LexerAdaptor extends Lexer {
    private currentRuleType;
    emit(): Token;
    protected handleBeginArgument(): void;
    protected handleEndArgument(): void;
    protected handleEndAction(): void;
}
