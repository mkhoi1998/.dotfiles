import { ATN } from "antlr4ts/atn/ATN";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { ANTLRv4ParserListener } from "./ANTLRv4ParserListener";
import { ANTLRv4ParserVisitor } from "./ANTLRv4ParserVisitor";
export declare class ANTLRv4Parser extends Parser {
    static readonly TOKEN_REF = 1;
    static readonly RULE_REF = 2;
    static readonly LEXER_CHAR_SET = 3;
    static readonly DOC_COMMENT = 4;
    static readonly BLOCK_COMMENT = 5;
    static readonly LINE_COMMENT = 6;
    static readonly INT = 7;
    static readonly STRING_LITERAL = 8;
    static readonly UNTERMINATED_STRING_LITERAL = 9;
    static readonly BEGIN_ARGUMENT = 10;
    static readonly BEGIN_ACTION = 11;
    static readonly OPTIONS = 12;
    static readonly TOKENS = 13;
    static readonly CHANNELS = 14;
    static readonly IMPORT = 15;
    static readonly FRAGMENT = 16;
    static readonly LEXER = 17;
    static readonly PARSER = 18;
    static readonly GRAMMAR = 19;
    static readonly PROTECTED = 20;
    static readonly PUBLIC = 21;
    static readonly PRIVATE = 22;
    static readonly RETURNS = 23;
    static readonly LOCALS = 24;
    static readonly THROWS = 25;
    static readonly CATCH = 26;
    static readonly FINALLY = 27;
    static readonly MODE = 28;
    static readonly COLON = 29;
    static readonly COLONCOLON = 30;
    static readonly COMMA = 31;
    static readonly SEMI = 32;
    static readonly LPAREN = 33;
    static readonly RPAREN = 34;
    static readonly LBRACE = 35;
    static readonly RBRACE = 36;
    static readonly RARROW = 37;
    static readonly LT = 38;
    static readonly GT = 39;
    static readonly ASSIGN = 40;
    static readonly QUESTION = 41;
    static readonly STAR = 42;
    static readonly PLUS_ASSIGN = 43;
    static readonly PLUS = 44;
    static readonly OR = 45;
    static readonly DOLLAR = 46;
    static readonly RANGE = 47;
    static readonly DOT = 48;
    static readonly AT = 49;
    static readonly POUND = 50;
    static readonly NOT = 51;
    static readonly ID = 52;
    static readonly WS = 53;
    static readonly END_ARGUMENT = 54;
    static readonly UNTERMINATED_ARGUMENT = 55;
    static readonly ARGUMENT_CONTENT = 56;
    static readonly END_ACTION = 57;
    static readonly UNTERMINATED_ACTION = 58;
    static readonly ACTION_CONTENT = 59;
    static readonly UNTERMINATED_CHAR_SET = 60;
    static readonly RULE_grammarSpec = 0;
    static readonly RULE_grammarType = 1;
    static readonly RULE_prequelConstruct = 2;
    static readonly RULE_optionsSpec = 3;
    static readonly RULE_option = 4;
    static readonly RULE_optionValue = 5;
    static readonly RULE_delegateGrammars = 6;
    static readonly RULE_delegateGrammar = 7;
    static readonly RULE_tokensSpec = 8;
    static readonly RULE_channelsSpec = 9;
    static readonly RULE_idList = 10;
    static readonly RULE_namedAction = 11;
    static readonly RULE_actionScopeName = 12;
    static readonly RULE_actionBlock = 13;
    static readonly RULE_argActionBlock = 14;
    static readonly RULE_modeSpec = 15;
    static readonly RULE_rules = 16;
    static readonly RULE_ruleSpec = 17;
    static readonly RULE_parserRuleSpec = 18;
    static readonly RULE_exceptionGroup = 19;
    static readonly RULE_exceptionHandler = 20;
    static readonly RULE_finallyClause = 21;
    static readonly RULE_rulePrequel = 22;
    static readonly RULE_ruleReturns = 23;
    static readonly RULE_throwsSpec = 24;
    static readonly RULE_localsSpec = 25;
    static readonly RULE_ruleAction = 26;
    static readonly RULE_ruleModifiers = 27;
    static readonly RULE_ruleModifier = 28;
    static readonly RULE_ruleBlock = 29;
    static readonly RULE_ruleAltList = 30;
    static readonly RULE_labeledAlt = 31;
    static readonly RULE_lexerRuleSpec = 32;
    static readonly RULE_lexerRuleBlock = 33;
    static readonly RULE_lexerAltList = 34;
    static readonly RULE_lexerAlt = 35;
    static readonly RULE_lexerElements = 36;
    static readonly RULE_lexerElement = 37;
    static readonly RULE_labeledLexerElement = 38;
    static readonly RULE_lexerBlock = 39;
    static readonly RULE_lexerCommands = 40;
    static readonly RULE_lexerCommand = 41;
    static readonly RULE_lexerCommandName = 42;
    static readonly RULE_lexerCommandExpr = 43;
    static readonly RULE_altList = 44;
    static readonly RULE_alternative = 45;
    static readonly RULE_element = 46;
    static readonly RULE_labeledElement = 47;
    static readonly RULE_ebnf = 48;
    static readonly RULE_blockSuffix = 49;
    static readonly RULE_ebnfSuffix = 50;
    static readonly RULE_lexerAtom = 51;
    static readonly RULE_atom = 52;
    static readonly RULE_notSet = 53;
    static readonly RULE_blockSet = 54;
    static readonly RULE_setElement = 55;
    static readonly RULE_block = 56;
    static readonly RULE_ruleref = 57;
    static readonly RULE_characterRange = 58;
    static readonly RULE_terminalRule = 59;
    static readonly RULE_elementOptions = 60;
    static readonly RULE_elementOption = 61;
    static readonly RULE_identifier = 62;
    static readonly ruleNames: string[];
    private static readonly _LITERAL_NAMES;
    private static readonly _SYMBOLIC_NAMES;
    static readonly VOCABULARY: Vocabulary;
    readonly vocabulary: Vocabulary;
    readonly grammarFileName: string;
    readonly ruleNames: string[];
    readonly serializedATN: string;
    constructor(input: TokenStream);
    grammarSpec(): GrammarSpecContext;
    grammarType(): GrammarTypeContext;
    prequelConstruct(): PrequelConstructContext;
    optionsSpec(): OptionsSpecContext;
    option(): OptionContext;
    optionValue(): OptionValueContext;
    delegateGrammars(): DelegateGrammarsContext;
    delegateGrammar(): DelegateGrammarContext;
    tokensSpec(): TokensSpecContext;
    channelsSpec(): ChannelsSpecContext;
    idList(): IdListContext;
    namedAction(): NamedActionContext;
    actionScopeName(): ActionScopeNameContext;
    actionBlock(): ActionBlockContext;
    argActionBlock(): ArgActionBlockContext;
    modeSpec(): ModeSpecContext;
    rules(): RulesContext;
    ruleSpec(): RuleSpecContext;
    parserRuleSpec(): ParserRuleSpecContext;
    exceptionGroup(): ExceptionGroupContext;
    exceptionHandler(): ExceptionHandlerContext;
    finallyClause(): FinallyClauseContext;
    rulePrequel(): RulePrequelContext;
    ruleReturns(): RuleReturnsContext;
    throwsSpec(): ThrowsSpecContext;
    localsSpec(): LocalsSpecContext;
    ruleAction(): RuleActionContext;
    ruleModifiers(): RuleModifiersContext;
    ruleModifier(): RuleModifierContext;
    ruleBlock(): RuleBlockContext;
    ruleAltList(): RuleAltListContext;
    labeledAlt(): LabeledAltContext;
    lexerRuleSpec(): LexerRuleSpecContext;
    lexerRuleBlock(): LexerRuleBlockContext;
    lexerAltList(): LexerAltListContext;
    lexerAlt(): LexerAltContext;
    lexerElements(): LexerElementsContext;
    lexerElement(): LexerElementContext;
    labeledLexerElement(): LabeledLexerElementContext;
    lexerBlock(): LexerBlockContext;
    lexerCommands(): LexerCommandsContext;
    lexerCommand(): LexerCommandContext;
    lexerCommandName(): LexerCommandNameContext;
    lexerCommandExpr(): LexerCommandExprContext;
    altList(): AltListContext;
    alternative(): AlternativeContext;
    element(): ElementContext;
    labeledElement(): LabeledElementContext;
    ebnf(): EbnfContext;
    blockSuffix(): BlockSuffixContext;
    ebnfSuffix(): EbnfSuffixContext;
    lexerAtom(): LexerAtomContext;
    atom(): AtomContext;
    notSet(): NotSetContext;
    blockSet(): BlockSetContext;
    setElement(): SetElementContext;
    block(): BlockContext;
    ruleref(): RulerefContext;
    characterRange(): CharacterRangeContext;
    terminalRule(): TerminalRuleContext;
    elementOptions(): ElementOptionsContext;
    elementOption(): ElementOptionContext;
    identifier(): IdentifierContext;
    private static readonly _serializedATNSegments;
    private static readonly _serializedATNSegment0;
    private static readonly _serializedATNSegment1;
    static readonly _serializedATN: string;
    static __ATN: ATN;
    static readonly _ATN: ATN;
}
export declare class GrammarSpecContext extends ParserRuleContext {
    grammarType(): GrammarTypeContext;
    identifier(): IdentifierContext;
    SEMI(): TerminalNode;
    rules(): RulesContext;
    EOF(): TerminalNode;
    DOC_COMMENT(): TerminalNode[];
    DOC_COMMENT(i: number): TerminalNode;
    prequelConstruct(): PrequelConstructContext[];
    prequelConstruct(i: number): PrequelConstructContext;
    modeSpec(): ModeSpecContext[];
    modeSpec(i: number): ModeSpecContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class GrammarTypeContext extends ParserRuleContext {
    LEXER(): TerminalNode | undefined;
    GRAMMAR(): TerminalNode | undefined;
    PARSER(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class PrequelConstructContext extends ParserRuleContext {
    optionsSpec(): OptionsSpecContext | undefined;
    delegateGrammars(): DelegateGrammarsContext | undefined;
    tokensSpec(): TokensSpecContext | undefined;
    channelsSpec(): ChannelsSpecContext | undefined;
    namedAction(): NamedActionContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class OptionsSpecContext extends ParserRuleContext {
    OPTIONS(): TerminalNode;
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    option(): OptionContext[];
    option(i: number): OptionContext;
    SEMI(): TerminalNode[];
    SEMI(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class OptionContext extends ParserRuleContext {
    identifier(): IdentifierContext;
    ASSIGN(): TerminalNode;
    optionValue(): OptionValueContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class OptionValueContext extends ParserRuleContext {
    identifier(): IdentifierContext[];
    identifier(i: number): IdentifierContext;
    DOT(): TerminalNode[];
    DOT(i: number): TerminalNode;
    STRING_LITERAL(): TerminalNode | undefined;
    actionBlock(): ActionBlockContext | undefined;
    INT(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class DelegateGrammarsContext extends ParserRuleContext {
    IMPORT(): TerminalNode;
    delegateGrammar(): DelegateGrammarContext[];
    delegateGrammar(i: number): DelegateGrammarContext;
    SEMI(): TerminalNode;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class DelegateGrammarContext extends ParserRuleContext {
    identifier(): IdentifierContext[];
    identifier(i: number): IdentifierContext;
    ASSIGN(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class TokensSpecContext extends ParserRuleContext {
    TOKENS(): TerminalNode;
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    idList(): IdListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ChannelsSpecContext extends ParserRuleContext {
    CHANNELS(): TerminalNode;
    LBRACE(): TerminalNode;
    RBRACE(): TerminalNode;
    idList(): IdListContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class IdListContext extends ParserRuleContext {
    identifier(): IdentifierContext[];
    identifier(i: number): IdentifierContext;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class NamedActionContext extends ParserRuleContext {
    AT(): TerminalNode;
    identifier(): IdentifierContext;
    actionBlock(): ActionBlockContext;
    actionScopeName(): ActionScopeNameContext | undefined;
    COLONCOLON(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ActionScopeNameContext extends ParserRuleContext {
    identifier(): IdentifierContext | undefined;
    LEXER(): TerminalNode | undefined;
    PARSER(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ActionBlockContext extends ParserRuleContext {
    BEGIN_ACTION(): TerminalNode;
    END_ACTION(): TerminalNode;
    ACTION_CONTENT(): TerminalNode[];
    ACTION_CONTENT(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ArgActionBlockContext extends ParserRuleContext {
    BEGIN_ARGUMENT(): TerminalNode;
    END_ARGUMENT(): TerminalNode;
    ARGUMENT_CONTENT(): TerminalNode[];
    ARGUMENT_CONTENT(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ModeSpecContext extends ParserRuleContext {
    MODE(): TerminalNode;
    identifier(): IdentifierContext;
    SEMI(): TerminalNode;
    lexerRuleSpec(): LexerRuleSpecContext[];
    lexerRuleSpec(i: number): LexerRuleSpecContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RulesContext extends ParserRuleContext {
    ruleSpec(): RuleSpecContext[];
    ruleSpec(i: number): RuleSpecContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleSpecContext extends ParserRuleContext {
    parserRuleSpec(): ParserRuleSpecContext | undefined;
    lexerRuleSpec(): LexerRuleSpecContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ParserRuleSpecContext extends ParserRuleContext {
    RULE_REF(): TerminalNode;
    COLON(): TerminalNode;
    ruleBlock(): RuleBlockContext;
    SEMI(): TerminalNode;
    exceptionGroup(): ExceptionGroupContext;
    DOC_COMMENT(): TerminalNode[];
    DOC_COMMENT(i: number): TerminalNode;
    ruleModifiers(): RuleModifiersContext | undefined;
    argActionBlock(): ArgActionBlockContext | undefined;
    ruleReturns(): RuleReturnsContext | undefined;
    throwsSpec(): ThrowsSpecContext | undefined;
    localsSpec(): LocalsSpecContext | undefined;
    rulePrequel(): RulePrequelContext[];
    rulePrequel(i: number): RulePrequelContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ExceptionGroupContext extends ParserRuleContext {
    exceptionHandler(): ExceptionHandlerContext[];
    exceptionHandler(i: number): ExceptionHandlerContext;
    finallyClause(): FinallyClauseContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ExceptionHandlerContext extends ParserRuleContext {
    CATCH(): TerminalNode;
    argActionBlock(): ArgActionBlockContext;
    actionBlock(): ActionBlockContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class FinallyClauseContext extends ParserRuleContext {
    FINALLY(): TerminalNode;
    actionBlock(): ActionBlockContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RulePrequelContext extends ParserRuleContext {
    optionsSpec(): OptionsSpecContext | undefined;
    ruleAction(): RuleActionContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleReturnsContext extends ParserRuleContext {
    RETURNS(): TerminalNode;
    argActionBlock(): ArgActionBlockContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ThrowsSpecContext extends ParserRuleContext {
    THROWS(): TerminalNode;
    identifier(): IdentifierContext[];
    identifier(i: number): IdentifierContext;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LocalsSpecContext extends ParserRuleContext {
    LOCALS(): TerminalNode;
    argActionBlock(): ArgActionBlockContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleActionContext extends ParserRuleContext {
    AT(): TerminalNode;
    identifier(): IdentifierContext;
    actionBlock(): ActionBlockContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleModifiersContext extends ParserRuleContext {
    ruleModifier(): RuleModifierContext[];
    ruleModifier(i: number): RuleModifierContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleModifierContext extends ParserRuleContext {
    PUBLIC(): TerminalNode | undefined;
    PRIVATE(): TerminalNode | undefined;
    PROTECTED(): TerminalNode | undefined;
    FRAGMENT(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleBlockContext extends ParserRuleContext {
    ruleAltList(): RuleAltListContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RuleAltListContext extends ParserRuleContext {
    labeledAlt(): LabeledAltContext[];
    labeledAlt(i: number): LabeledAltContext;
    OR(): TerminalNode[];
    OR(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LabeledAltContext extends ParserRuleContext {
    alternative(): AlternativeContext;
    POUND(): TerminalNode | undefined;
    identifier(): IdentifierContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerRuleSpecContext extends ParserRuleContext {
    TOKEN_REF(): TerminalNode;
    COLON(): TerminalNode;
    lexerRuleBlock(): LexerRuleBlockContext;
    SEMI(): TerminalNode;
    DOC_COMMENT(): TerminalNode[];
    DOC_COMMENT(i: number): TerminalNode;
    FRAGMENT(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerRuleBlockContext extends ParserRuleContext {
    lexerAltList(): LexerAltListContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerAltListContext extends ParserRuleContext {
    lexerAlt(): LexerAltContext[];
    lexerAlt(i: number): LexerAltContext;
    OR(): TerminalNode[];
    OR(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerAltContext extends ParserRuleContext {
    lexerElements(): LexerElementsContext | undefined;
    lexerCommands(): LexerCommandsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerElementsContext extends ParserRuleContext {
    lexerElement(): LexerElementContext[];
    lexerElement(i: number): LexerElementContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerElementContext extends ParserRuleContext {
    labeledLexerElement(): LabeledLexerElementContext | undefined;
    ebnfSuffix(): EbnfSuffixContext | undefined;
    lexerAtom(): LexerAtomContext | undefined;
    lexerBlock(): LexerBlockContext | undefined;
    actionBlock(): ActionBlockContext | undefined;
    QUESTION(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LabeledLexerElementContext extends ParserRuleContext {
    identifier(): IdentifierContext;
    ASSIGN(): TerminalNode | undefined;
    PLUS_ASSIGN(): TerminalNode | undefined;
    lexerAtom(): LexerAtomContext | undefined;
    block(): BlockContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerBlockContext extends ParserRuleContext {
    LPAREN(): TerminalNode;
    lexerAltList(): LexerAltListContext;
    RPAREN(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerCommandsContext extends ParserRuleContext {
    RARROW(): TerminalNode;
    lexerCommand(): LexerCommandContext[];
    lexerCommand(i: number): LexerCommandContext;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerCommandContext extends ParserRuleContext {
    lexerCommandName(): LexerCommandNameContext;
    LPAREN(): TerminalNode | undefined;
    lexerCommandExpr(): LexerCommandExprContext | undefined;
    RPAREN(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerCommandNameContext extends ParserRuleContext {
    identifier(): IdentifierContext | undefined;
    MODE(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerCommandExprContext extends ParserRuleContext {
    identifier(): IdentifierContext | undefined;
    INT(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class AltListContext extends ParserRuleContext {
    alternative(): AlternativeContext[];
    alternative(i: number): AlternativeContext;
    OR(): TerminalNode[];
    OR(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class AlternativeContext extends ParserRuleContext {
    elementOptions(): ElementOptionsContext | undefined;
    element(): ElementContext[];
    element(i: number): ElementContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ElementContext extends ParserRuleContext {
    labeledElement(): LabeledElementContext | undefined;
    ebnfSuffix(): EbnfSuffixContext | undefined;
    atom(): AtomContext | undefined;
    ebnf(): EbnfContext | undefined;
    actionBlock(): ActionBlockContext | undefined;
    QUESTION(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LabeledElementContext extends ParserRuleContext {
    identifier(): IdentifierContext;
    ASSIGN(): TerminalNode | undefined;
    PLUS_ASSIGN(): TerminalNode | undefined;
    atom(): AtomContext | undefined;
    block(): BlockContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class EbnfContext extends ParserRuleContext {
    block(): BlockContext;
    blockSuffix(): BlockSuffixContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class BlockSuffixContext extends ParserRuleContext {
    ebnfSuffix(): EbnfSuffixContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class EbnfSuffixContext extends ParserRuleContext {
    QUESTION(): TerminalNode[];
    QUESTION(i: number): TerminalNode;
    STAR(): TerminalNode | undefined;
    PLUS(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class LexerAtomContext extends ParserRuleContext {
    characterRange(): CharacterRangeContext | undefined;
    terminalRule(): TerminalRuleContext | undefined;
    notSet(): NotSetContext | undefined;
    LEXER_CHAR_SET(): TerminalNode | undefined;
    DOT(): TerminalNode | undefined;
    elementOptions(): ElementOptionsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class AtomContext extends ParserRuleContext {
    characterRange(): CharacterRangeContext | undefined;
    terminalRule(): TerminalRuleContext | undefined;
    ruleref(): RulerefContext | undefined;
    notSet(): NotSetContext | undefined;
    DOT(): TerminalNode | undefined;
    elementOptions(): ElementOptionsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class NotSetContext extends ParserRuleContext {
    NOT(): TerminalNode;
    setElement(): SetElementContext | undefined;
    blockSet(): BlockSetContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class BlockSetContext extends ParserRuleContext {
    LPAREN(): TerminalNode;
    setElement(): SetElementContext[];
    setElement(i: number): SetElementContext;
    RPAREN(): TerminalNode;
    OR(): TerminalNode[];
    OR(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class SetElementContext extends ParserRuleContext {
    TOKEN_REF(): TerminalNode | undefined;
    elementOptions(): ElementOptionsContext | undefined;
    STRING_LITERAL(): TerminalNode | undefined;
    characterRange(): CharacterRangeContext | undefined;
    LEXER_CHAR_SET(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class BlockContext extends ParserRuleContext {
    LPAREN(): TerminalNode;
    altList(): AltListContext;
    RPAREN(): TerminalNode;
    COLON(): TerminalNode | undefined;
    optionsSpec(): OptionsSpecContext | undefined;
    ruleAction(): RuleActionContext[];
    ruleAction(i: number): RuleActionContext;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class RulerefContext extends ParserRuleContext {
    RULE_REF(): TerminalNode;
    argActionBlock(): ArgActionBlockContext | undefined;
    elementOptions(): ElementOptionsContext | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class CharacterRangeContext extends ParserRuleContext {
    STRING_LITERAL(): TerminalNode[];
    STRING_LITERAL(i: number): TerminalNode;
    RANGE(): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class TerminalRuleContext extends ParserRuleContext {
    TOKEN_REF(): TerminalNode | undefined;
    elementOptions(): ElementOptionsContext | undefined;
    STRING_LITERAL(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ElementOptionsContext extends ParserRuleContext {
    LT(): TerminalNode;
    elementOption(): ElementOptionContext[];
    elementOption(i: number): ElementOptionContext;
    GT(): TerminalNode;
    COMMA(): TerminalNode[];
    COMMA(i: number): TerminalNode;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class ElementOptionContext extends ParserRuleContext {
    identifier(): IdentifierContext[];
    identifier(i: number): IdentifierContext;
    ASSIGN(): TerminalNode | undefined;
    STRING_LITERAL(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
export declare class IdentifierContext extends ParserRuleContext {
    RULE_REF(): TerminalNode | undefined;
    TOKEN_REF(): TerminalNode | undefined;
    constructor(parent: ParserRuleContext | undefined, invokingState: number);
    readonly ruleIndex: number;
    enterRule(listener: ANTLRv4ParserListener): void;
    exitRule(listener: ANTLRv4ParserListener): void;
    accept<Result>(visitor: ANTLRv4ParserVisitor<Result>): Result;
}
