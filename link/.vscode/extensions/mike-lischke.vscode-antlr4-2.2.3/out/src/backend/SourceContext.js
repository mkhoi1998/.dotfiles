"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const antlr4ts_1 = require("antlr4ts");
const atn_1 = require("antlr4ts/atn");
const misc_1 = require("antlr4ts/misc");
const tree_1 = require("antlr4ts/tree");
const antlr4_c3_1 = require("antlr4-c3");
const ANTLRv4Parser_1 = require("../parser/ANTLRv4Parser");
const ANTLRv4Lexer_1 = require("../parser/ANTLRv4Lexer");
const facade_1 = require("./facade");
const ContextErrorListener_1 = require("./ContextErrorListener");
const DetailsListener_1 = require("./DetailsListener");
const SemanticListener_1 = require("./SemanticListener");
const RuleVisitor_1 = require("./RuleVisitor");
const InterpreterDataReader_1 = require("./InterpreterDataReader");
const ErrorParser_1 = require("./ErrorParser");
const ContextSymbolTable_1 = require("./ContextSymbolTable");
const SentenceGenerator_1 = require("./SentenceGenerator");
const Formatter_1 = require("./Formatter");
const GrammarInterpreters_1 = require("./GrammarInterpreters");
var GrammarType;
(function (GrammarType) {
    GrammarType[GrammarType["Unknown"] = 0] = "Unknown";
    GrammarType[GrammarType["Parser"] = 1] = "Parser";
    GrammarType[GrammarType["Lexer"] = 2] = "Lexer";
    GrammarType[GrammarType["Combined"] = 3] = "Combined";
})(GrammarType || (GrammarType = {}));
;
class SourceContext {
    constructor(fileName) {
        this.fileName = fileName;
        this.diagnostics = [];
        this.references = [];
        this.semanticAnalysisDone = false;
        this.errorListener = new ContextErrorListener_1.ContextErrorListener(this.diagnostics);
        this.lexerErrorListener = new ContextErrorListener_1.ContextLexerErrorListener(this.diagnostics);
        this.grammarLexerRuleMap = new Map();
        this.grammarParserRuleMap = new Map();
        this.imports = [];
        this.sourceId = path.basename(fileName, path.extname(fileName));
        this.symbolTable = new ContextSymbolTable_1.ContextSymbolTable(this.sourceId, { allowDuplicateSymbols: true }, this);
        if (!SourceContext.globalSymbols.resolve("EOF")) {
            SourceContext.globalSymbols.addNewSymbolOfType(ContextSymbolTable_1.BuiltInChannelSymbol, undefined, "DEFAULT_TOKEN_CHANNEL");
            SourceContext.globalSymbols.addNewSymbolOfType(ContextSymbolTable_1.BuiltInChannelSymbol, undefined, "HIDDEN");
            SourceContext.globalSymbols.addNewSymbolOfType(ContextSymbolTable_1.BuiltInTokenSymbol, undefined, "EOF");
            SourceContext.globalSymbols.addNewSymbolOfType(ContextSymbolTable_1.BuiltInModeSymbol, undefined, "DEFAULT_MODE");
        }
    }
    symbolAtPosition(column, row, limitToChildren) {
        let terminal = parseTreeFromPosition(this.tree, column, row);
        if (!terminal || !(terminal instanceof tree_1.TerminalNode)) {
            return undefined;
        }
        if (!limitToChildren) {
            return this.getSymbolInfo(terminal.text);
        }
        let parent = terminal.parent;
        if (parent.ruleIndex == ANTLRv4Parser_1.ANTLRv4Parser.RULE_identifier) {
            parent = parent.parent;
        }
        switch (parent.ruleIndex) {
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_ruleref:
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_terminalRule:
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_lexerCommandExpr:
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_optionValue:
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_delegateGrammar:
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_modeSpec:
            case ANTLRv4Parser_1.ANTLRv4Parser.RULE_setElement:
                return this.getSymbolInfo(terminal.text);
        }
        return undefined;
    }
    enclosingSymbolAtPosition(column, row, ruleScope) {
        let context = parseTreeFromPosition(this.tree, column, row);
        if (!context) {
            return;
        }
        if (context instanceof tree_1.TerminalNode) {
            context = context.parent;
        }
        if (ruleScope) {
            let run = context;
            while (run
                && !(run instanceof ANTLRv4Parser_1.ParserRuleSpecContext)
                && !(run instanceof ANTLRv4Parser_1.OptionsSpecContext)
                && !(run instanceof ANTLRv4Parser_1.LexerRuleSpecContext)) {
                run = run.parent;
            }
            if (run) {
                context = run;
            }
        }
        let symbol = this.symbolTable.symbolWithContext(context);
        if (symbol) {
            return this.symbolTable.getSymbolInfo(symbol);
        }
    }
    listTopLevelSymbols(includeDependencies) {
        return this.symbolTable.listTopLevelSymbols(includeDependencies);
    }
    getVocabulary() {
        if (this.grammarLexerData) {
            return this.grammarLexerData.vocabulary;
        }
    }
    getRuleList() {
        if (this.grammarParserData) {
            return this.grammarParserData.ruleNames;
        }
    }
    getChannels() {
        if (this.grammarLexerData) {
            return this.grammarLexerData.channels;
        }
    }
    getModes() {
        if (this.grammarLexerData) {
            return this.grammarLexerData.modes;
        }
    }
    listActions() {
        return this.symbolTable.listActions();
    }
    getCodeCompletionCandidates(column, row) {
        if (!this.parser) {
            return [];
        }
        let core = new antlr4_c3_1.CodeCompletionCore(this.parser);
        core.showResult = false;
        core.ignoredTokens = new Set([
            ANTLRv4Lexer_1.ANTLRv4Lexer.TOKEN_REF,
            ANTLRv4Lexer_1.ANTLRv4Lexer.RULE_REF,
            ANTLRv4Lexer_1.ANTLRv4Lexer.LEXER_CHAR_SET,
            ANTLRv4Lexer_1.ANTLRv4Lexer.DOC_COMMENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.BLOCK_COMMENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.LINE_COMMENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.INT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.STRING_LITERAL,
            ANTLRv4Lexer_1.ANTLRv4Lexer.UNTERMINATED_STRING_LITERAL,
            ANTLRv4Lexer_1.ANTLRv4Lexer.MODE,
            ANTLRv4Lexer_1.ANTLRv4Lexer.COLON,
            ANTLRv4Lexer_1.ANTLRv4Lexer.COLONCOLON,
            ANTLRv4Lexer_1.ANTLRv4Lexer.COMMA,
            ANTLRv4Lexer_1.ANTLRv4Lexer.SEMI,
            ANTLRv4Lexer_1.ANTLRv4Lexer.LPAREN,
            ANTLRv4Lexer_1.ANTLRv4Lexer.RPAREN,
            ANTLRv4Lexer_1.ANTLRv4Lexer.LBRACE,
            ANTLRv4Lexer_1.ANTLRv4Lexer.RBRACE,
            ANTLRv4Lexer_1.ANTLRv4Lexer.GT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.DOLLAR,
            ANTLRv4Lexer_1.ANTLRv4Lexer.RANGE,
            ANTLRv4Lexer_1.ANTLRv4Lexer.DOT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.AT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.POUND,
            ANTLRv4Lexer_1.ANTLRv4Lexer.NOT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.ID,
            ANTLRv4Lexer_1.ANTLRv4Lexer.WS,
            ANTLRv4Lexer_1.ANTLRv4Lexer.END_ARGUMENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.UNTERMINATED_ARGUMENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.ARGUMENT_CONTENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.END_ACTION,
            ANTLRv4Lexer_1.ANTLRv4Lexer.UNTERMINATED_ACTION,
            ANTLRv4Lexer_1.ANTLRv4Lexer.ACTION_CONTENT,
            ANTLRv4Lexer_1.ANTLRv4Lexer.UNTERMINATED_CHAR_SET,
            ANTLRv4Lexer_1.ANTLRv4Lexer.EOF,
            -2,
        ]);
        core.preferredRules = new Set([
            ANTLRv4Parser_1.ANTLRv4Parser.RULE_argActionBlock,
            ANTLRv4Parser_1.ANTLRv4Parser.RULE_actionBlock,
            ANTLRv4Parser_1.ANTLRv4Parser.RULE_terminalRule,
            ANTLRv4Parser_1.ANTLRv4Parser.RULE_lexerCommandName,
            ANTLRv4Parser_1.ANTLRv4Parser.RULE_identifier,
            ANTLRv4Parser_1.ANTLRv4Parser.RULE_ruleref,
        ]);
        let index;
        this.tokenStream.fill();
        for (index = 0;; ++index) {
            let token = this.tokenStream.get(index);
            if (token.type == antlr4ts_1.Token.EOF || token.line > row) {
                break;
            }
            if (token.line < row) {
                continue;
            }
            let length = token.text ? token.text.length : 0;
            if ((token.charPositionInLine + length) >= column) {
                break;
            }
        }
        let candidates = core.collectCandidates(index);
        let result = [];
        candidates.tokens.forEach((following, type) => {
            var info = new facade_1.SymbolInfo();
            info.source = this.fileName;
            switch (type) {
                case ANTLRv4Lexer_1.ANTLRv4Lexer.RARROW:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "->";
                    info.description = "Lexer action introducer";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.LT:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "< key = value >";
                    info.description = "Rule element option";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.ASSIGN:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "=";
                    info.description = "Variable assignment";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.QUESTION:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "?";
                    info.description = "Zero or one repetition operator";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.STAR:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "*";
                    info.description = "Zero or more repetition operator";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.PLUS_ASSIGN:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "+=";
                    info.description = "Variable list addition";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.PLUS:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "+";
                    info.description = "One or more repetition operator";
                    break;
                case ANTLRv4Lexer_1.ANTLRv4Lexer.OR:
                    info.kind = facade_1.SymbolKind.Operator;
                    info.name = "|";
                    info.description = "Rule alt separator";
                    break;
                default: {
                    let value = this.parser.vocabulary.getDisplayName(type);
                    info.kind = facade_1.SymbolKind.Keyword;
                    info.name = value[0] === "'" ? value.substr(1, value.length - 2) : value;
                    break;
                }
            }
            result.push(info);
        });
        candidates.rules.forEach((callStack, key) => {
            switch (key) {
                case ANTLRv4Parser_1.ANTLRv4Parser.RULE_argActionBlock: {
                    result.push({
                        kind: facade_1.SymbolKind.Action,
                        name: "[ argument action code ]",
                        source: this.fileName,
                        definition: undefined,
                        description: undefined
                    });
                    break;
                }
                case ANTLRv4Parser_1.ANTLRv4Parser.RULE_actionBlock: {
                    result.push({
                        kind: facade_1.SymbolKind.Action,
                        name: "{ action code }",
                        source: this.fileName,
                        definition: undefined,
                        description: undefined
                    });
                    if (callStack[callStack.length - 1] === ANTLRv4Parser_1.ANTLRv4Parser.RULE_lexerElement
                        || callStack[callStack.length - 1] === ANTLRv4Parser_1.ANTLRv4Parser.RULE_element) {
                        result.push({
                            kind: facade_1.SymbolKind.Predicate,
                            name: "{ predicate }?",
                            source: this.fileName,
                            definition: undefined,
                            description: undefined
                        });
                    }
                    break;
                }
                case ANTLRv4Parser_1.ANTLRv4Parser.RULE_terminalRule: {
                    this.symbolTable.getAllSymbols(ContextSymbolTable_1.BuiltInTokenSymbol).forEach(symbol => {
                        if (symbol.name !== "EOF") {
                            result.push({
                                kind: facade_1.SymbolKind.BuiltInLexerToken,
                                name: symbol.name,
                                source: this.fileName,
                                definition: undefined,
                                description: undefined
                            });
                        }
                    });
                    this.symbolTable.getAllSymbols(ContextSymbolTable_1.VirtualTokenSymbol).forEach(symbol => {
                        result.push({
                            kind: facade_1.SymbolKind.VirtualLexerToken,
                            name: symbol.name,
                            source: this.fileName,
                            definition: undefined,
                            description: undefined
                        });
                    });
                    if (callStack[callStack.length - 1] === ANTLRv4Parser_1.ANTLRv4Parser.RULE_lexerAtom) {
                        this.symbolTable.getAllSymbols(ContextSymbolTable_1.FragmentTokenSymbol).forEach(symbol => {
                            result.push({
                                kind: facade_1.SymbolKind.FragmentLexerToken,
                                name: symbol.name,
                                source: this.fileName,
                                definition: undefined,
                                description: undefined
                            });
                        });
                    }
                    this.symbolTable.getAllSymbols(ContextSymbolTable_1.TokenSymbol).forEach(symbol => {
                        result.push({
                            kind: facade_1.SymbolKind.LexerToken,
                            name: symbol.name,
                            source: this.fileName,
                            definition: undefined,
                            description: undefined
                        });
                    });
                    break;
                }
                case ANTLRv4Parser_1.ANTLRv4Parser.RULE_lexerCommandName: {
                    ["channel", "skip", "more", "mode", "push", "pop"].forEach(symbol => {
                        result.push({
                            kind: facade_1.SymbolKind.Keyword,
                            name: symbol,
                            source: this.fileName,
                            definition: undefined,
                            description: undefined
                        });
                    });
                    break;
                }
                case ANTLRv4Parser_1.ANTLRv4Parser.RULE_ruleref: {
                    this.symbolTable.getAllSymbols(ContextSymbolTable_1.RuleSymbol).forEach(symbol => {
                        result.push({
                            kind: facade_1.SymbolKind.ParserRule,
                            name: symbol.name,
                            source: this.fileName,
                            definition: undefined,
                            description: undefined
                        });
                    });
                    break;
                }
                case ANTLRv4Parser_1.ANTLRv4Parser.RULE_identifier: {
                    switch (callStack[callStack.length - 1]) {
                        case ANTLRv4Parser_1.ANTLRv4Parser.RULE_option: {
                            ["superClass", "tokenVocab", "TokenLabelType", "contextSuperClass", "exportMacro"]
                                .forEach(symbol => {
                                result.push({
                                    kind: facade_1.SymbolKind.Option,
                                    name: symbol,
                                    source: this.fileName,
                                    definition: undefined,
                                    description: undefined
                                });
                            });
                            break;
                        }
                        case ANTLRv4Parser_1.ANTLRv4Parser.RULE_namedAction: {
                            ["header", "members", "preinclude", "postinclude", "context", "declarations", "definitions",
                                "listenerpreinclude", "listenerpostinclude", "listenerdeclarations", "listenermembers",
                                "listenerdefinitions", "baselistenerpreinclude", "baselistenerpostinclude",
                                "baselistenerdeclarations", "baselistenermembers", "baselistenerdefinitions",
                                "visitorpreinclude", "visitorpostinclude", "visitordeclarations", "visitormembers",
                                "visitordefinitions", "basevisitorpreinclude", "basevisitorpostinclude",
                                "basevisitordeclarations", "basevisitormembers", "basevisitordefinitions"]
                                .forEach(symbol => {
                                result.push({
                                    kind: facade_1.SymbolKind.Keyword,
                                    name: symbol,
                                    source: this.fileName,
                                    definition: undefined,
                                    description: undefined
                                });
                            });
                            break;
                        }
                    }
                    break;
                }
            }
        });
        return result;
    }
    setText(source) {
        let input = antlr4ts_1.CharStreams.fromString(source);
        let lexer = new ANTLRv4Lexer_1.ANTLRv4Lexer(input);
        lexer.removeErrorListeners();
        lexer.addErrorListener(this.lexerErrorListener);
        this.tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
    }
    parse() {
        this.tokenStream.seek(0);
        this.parser = new ANTLRv4Parser_1.ANTLRv4Parser(this.tokenStream);
        this.parser.removeErrorListeners();
        this.parser.addErrorListener(this.errorListener);
        this.parser.errorHandler = new antlr4ts_1.BailErrorStrategy();
        this.parser.interpreter.setPredictionMode(atn_1.PredictionMode.SLL);
        this.tree = undefined;
        this.grammarType = GrammarType.Unknown;
        this.grammarLexerData = undefined;
        this.grammarLexerRuleMap.clear();
        this.grammarParserData = undefined;
        this.grammarLexerRuleMap.clear();
        this.semanticAnalysisDone = false;
        this.diagnostics.length = 0;
        this.imports.length = 0;
        this.symbolTable.clear();
        this.symbolTable.addDependencies(SourceContext.globalSymbols);
        try {
            this.tree = this.parser.grammarSpec();
        }
        catch (e) {
            if (e instanceof misc_1.ParseCancellationException) {
                this.tokenStream.seek(0);
                this.parser.reset();
                this.parser.errorHandler = new antlr4ts_1.DefaultErrorStrategy();
                this.parser.interpreter.setPredictionMode(atn_1.PredictionMode.LL);
                this.tree = this.parser.grammarSpec();
            }
            else {
                throw e;
            }
        }
        if (this.tree && this.tree.childCount > 0) {
            try {
                let typeContext = this.tree.grammarType();
                if (typeContext.LEXER()) {
                    this.grammarType = GrammarType.Lexer;
                }
                else if (typeContext.PARSER()) {
                    this.grammarType = GrammarType.Parser;
                }
                else {
                    this.grammarType = GrammarType.Combined;
                }
            }
            catch (e) {
            }
        }
        this.symbolTable.tree = this.tree;
        let listener = new DetailsListener_1.DetailsListener(this.symbolTable, this.imports);
        tree_1.ParseTreeWalker.DEFAULT.walk(listener, this.tree);
        return this.imports;
    }
    getDiagnostics() {
        this.runSemanticAnalysisIfNeeded();
        return this.diagnostics;
    }
    getUnreferencedRules() {
        return this.symbolTable.getUnreferencedSymbols();
    }
    getReferenceGraph() {
        this.runSemanticAnalysisIfNeeded();
        let result = new Map();
        for (let symbol of this.symbolTable.getAllSymbols(antlr4_c3_1.Symbol, false)) {
            if (symbol instanceof ContextSymbolTable_1.RuleSymbol
                || symbol instanceof ContextSymbolTable_1.TokenSymbol
                || symbol instanceof ContextSymbolTable_1.FragmentTokenSymbol) {
                let entry = {
                    kind: symbol instanceof ContextSymbolTable_1.RuleSymbol ? facade_1.SymbolKind.ParserRule : facade_1.SymbolKind.LexerToken,
                    rules: new Set(),
                    tokens: new Set(),
                    literals: new Set()
                };
                for (let child of symbol.getNestedSymbolsOfType(ContextSymbolTable_1.RuleReferenceSymbol)) {
                    let resolved = this.symbolTable.resolve(child.name, false);
                    if (resolved) {
                        entry.rules.add(resolved.qualifiedName());
                    }
                    else {
                        entry.rules.add(child.name);
                    }
                }
                let x = 10;
                for (let child of symbol.getNestedSymbolsOfType(ContextSymbolTable_1.TokenReferenceSymbol)) {
                    let resolved = this.symbolTable.resolve(child.name, false);
                    if (resolved) {
                        entry.tokens.add(resolved.qualifiedName());
                    }
                    else {
                        entry.tokens.add(child.name);
                    }
                }
                for (let child of symbol.getNestedSymbolsOfType(antlr4_c3_1.LiteralSymbol)) {
                    let resolved = this.symbolTable.resolve(child.name, false);
                    if (resolved) {
                        entry.literals.add(resolved.qualifiedName());
                    }
                    else {
                        entry.literals.add(child.name);
                    }
                }
                result.set(symbol.qualifiedName(), entry);
            }
            else if (symbol instanceof ContextSymbolTable_1.BuiltInTokenSymbol) {
                result.set(symbol.qualifiedName(), {
                    kind: facade_1.SymbolKind.BuiltInLexerToken,
                    rules: [],
                    tokens: [],
                    literals: []
                });
            }
            else if (symbol instanceof ContextSymbolTable_1.VirtualTokenSymbol) {
                result.set(symbol.qualifiedName(), {
                    kind: facade_1.SymbolKind.VirtualLexerToken,
                    rules: [],
                    tokens: [],
                    literals: []
                });
            }
        }
        return result;
    }
    getRRDScript(ruleName) {
        this.runSemanticAnalysisIfNeeded();
        return this.rrdScripts.get(ruleName);
    }
    addAsReferenceTo(context) {
        var pipeline = [context];
        while (pipeline.length > 0) {
            let current = pipeline.shift();
            if (!current) {
                continue;
            }
            if (current.references.indexOf(this) > -1) {
                return;
            }
            pipeline.push(...current.references);
        }
        context.references.push(this);
        this.symbolTable.addDependencies(context.symbolTable);
    }
    removeDependency(context) {
        let index = context.references.indexOf(this);
        if (index > -1) {
            context.references.splice(index, 1);
        }
        this.symbolTable.removeDependency(context.symbolTable);
    }
    getReferenceCount(symbol) {
        this.runSemanticAnalysisIfNeeded();
        let result = this.symbolTable.getReferenceCount(symbol);
        for (let reference of this.references) {
            result += reference.getReferenceCount(symbol);
        }
        return result;
    }
    getAllSymbols(recursive) {
        let result = this.symbolTable.getAllSymbols(antlr4_c3_1.Symbol, !recursive);
        for (let reference of this.references) {
            reference.symbolTable.getAllSymbols(antlr4_c3_1.Symbol, true).forEach(result.add, result);
        }
        return result;
    }
    ruleFromPosition(column, row) {
        let tree = parseTreeFromPosition(this.tree, column, row);
        if (!tree) {
            return [undefined, undefined];
        }
        let context = tree;
        while (context && context.ruleIndex != ANTLRv4Parser_1.ANTLRv4Parser.RULE_parserRuleSpec
            && context.ruleIndex != ANTLRv4Parser_1.ANTLRv4Parser.RULE_lexerRuleSpec) {
            context = context.parent;
        }
        if (context) {
            if (context.ruleIndex == ANTLRv4Parser_1.ANTLRv4Parser.RULE_parserRuleSpec) {
                const name = context.RULE_REF().text;
                let index;
                if (this.grammarParserData) {
                    index = this.grammarParserRuleMap.get(name);
                }
                return [name, index];
            }
            const name = context.TOKEN_REF().text;
            let index;
            if (this.grammarLexerData) {
                index = this.grammarLexerRuleMap.get(name);
            }
            return [name, index];
        }
        return [undefined, undefined];
    }
    generate(dependencies, options) {
        if (options.loadOnly) {
            this.setupInterpreters(options.outputDir);
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }
        let thisRef = this;
        return new Promise((resolve, reject) => {
            let parameters = ["-jar"];
            if (options.alternativeJar) {
                parameters.push(options.alternativeJar);
            }
            else {
                if (options.language === "typescript") {
                    parameters.push(path.join(__dirname, '../../../antlr/antlr4-typescript-4.7.3-SNAPSHOT-complete.jar'));
                }
                else {
                    parameters.push(path.join(__dirname, '../../../antlr/antlr4-4.7.2-SNAPSHOT-complete.jar'));
                }
            }
            if (options.language) {
                parameters.push("-Dlanguage=" + options.language);
            }
            parameters.push("-message-format");
            parameters.push("antlr");
            if (options.libDir) {
                parameters.push("-lib");
                parameters.push(options.libDir);
            }
            if (options.outputDir) {
                parameters.push("-o");
                parameters.push(options.outputDir);
            }
            if (options.package) {
                parameters.push("-package");
                parameters.push(options.package);
            }
            let genListener = options.listeners == undefined || options.listeners === true;
            parameters.push(genListener ? "-listener" : "-no-listener");
            parameters.push(options.visitors === true ? "-visitor" : "-no-visitor");
            parameters.push("-Xexact-output-dir");
            dependencies.add(thisRef);
            let fileList = [];
            for (let dependency of dependencies) {
                fileList.push(dependency.fileName);
            }
            parameters.push(...fileList);
            let spawnOptions = { cwd: options.baseDir ? options.baseDir : undefined };
            let java = child_process.spawn("java", parameters, spawnOptions);
            let buffer = "";
            java.stderr.on("data", (data) => {
                let text = data.toString();
                if (text.startsWith("Picked up _JAVA_OPTIONS:")) {
                    let endOfInfo = text.indexOf("\n");
                    if (endOfInfo == -1) {
                        text = "";
                    }
                    else {
                        text = text.substr(endOfInfo + 1, text.length);
                    }
                }
                if (text.length > 0) {
                    buffer += "\n" + text;
                }
            });
            java.on("close", (code) => {
                let parser = new ErrorParser_1.ErrorParser(dependencies);
                if (parser.convertErrorsToDiagnostics(buffer)) {
                    thisRef.setupInterpreters(options.outputDir);
                    resolve(fileList);
                }
                else {
                    reject(buffer);
                }
            });
        });
    }
    getATNGraph(rule) {
        let isLexerRule = rule[0] == rule[0].toUpperCase();
        if ((isLexerRule && !this.grammarLexerData) || (!isLexerRule && !this.grammarParserData)) {
            return;
        }
        let ruleIndexMap = isLexerRule ? this.grammarLexerRuleMap : this.grammarParserRuleMap;
        if (!ruleIndexMap.has(rule)) {
            return;
        }
        let ruleIndex = ruleIndexMap.get(rule);
        let atn = isLexerRule ? this.grammarLexerData.atn : this.grammarParserData.atn;
        let ruleNames = isLexerRule ? this.grammarLexerData.ruleNames : this.grammarParserData.ruleNames;
        let vocabulary = isLexerRule ? this.grammarLexerData.vocabulary : this.grammarParserData.vocabulary;
        let startState = atn.ruleToStartState[ruleIndex];
        let stopState = atn.ruleToStopState[ruleIndex];
        let seenStates = new Set([startState]);
        let pipeline = [startState];
        let result = new facade_1.ATNGraphData();
        result.links = [];
        result.nodes = [];
        let stateToIndex = new Map();
        let currentRuleIndex = -1;
        for (let state of atn.states) {
            if (state.ruleIndex == ruleIndex) {
                stateToIndex.set(state.stateNumber, result.nodes.length);
                result.nodes.push({ id: state.stateNumber, name: state.stateNumber.toString(), type: state.stateType });
                let transitions = state.getTransitions();
                if (transitions.length == 1 && transitions[0].target.stateType == atn_1.ATNStateType.RULE_START) {
                    let marker = state.stateNumber * transitions[0].target.stateNumber;
                    stateToIndex.set(marker, result.nodes.length);
                    result.nodes.push({
                        id: currentRuleIndex--,
                        name: ruleNames[transitions[0].target.ruleIndex],
                        type: 13
                    });
                }
            }
        }
        while (pipeline.length > 0) {
            let state = pipeline.shift();
            let nodeIndex = stateToIndex.get(state.stateNumber);
            for (let transition of state.getTransitions()) {
                if (state == stopState)
                    continue;
                let transitsToRule = transition.target.stateType == atn_1.ATNStateType.RULE_START;
                let marker = transition.target.stateNumber * (transitsToRule ? state.stateNumber : 1);
                let link = {
                    source: nodeIndex, target: stateToIndex.get(marker), type: transition.serializationType,
                    labels: new Array()
                };
                if (transition.isEpsilon) {
                    link.labels.push("ε");
                }
                else if (transition.label) {
                    if (isLexerRule) {
                        link.labels = this.intervalSetToStrings(transition.label);
                    }
                    else {
                        for (let label of transition.label.toArray()) {
                            link.labels.push(vocabulary.getDisplayName(label));
                        }
                    }
                }
                result.links.push(link);
                let nextState;
                if (transitsToRule) {
                    nextState = transition.followState;
                    let link = {
                        source: stateToIndex.get(marker), target: stateToIndex.get(nextState.stateNumber),
                        type: 3, labels: ["ε"]
                    };
                    result.links.push(link);
                }
                else {
                    nextState = transition.target;
                }
                if (seenStates.has(nextState))
                    continue;
                seenStates.add(nextState);
                pipeline.push(nextState);
            }
        }
        return result;
    }
    generateSentence(options, lexerDefinitions, parserDefinitions) {
        if (!this.grammarLexerData) {
            return "[No grammar data available]";
        }
        let isLexerRule = options.startRule[0] == options.startRule[0].toUpperCase();
        let start;
        if (isLexerRule) {
            let index = this.grammarLexerRuleMap.get(options.startRule);
            if (index == undefined) {
                return "[Virtual or undefined token]";
            }
            start = this.grammarLexerData.atn.ruleToStartState[index];
        }
        else {
            if (!this.grammarParserData) {
                return "[No parser data available]";
            }
            let index = this.grammarParserRuleMap.get(options.startRule);
            if (index == undefined) {
                return "[Undefined rule]";
            }
            start = this.grammarParserData.atn.ruleToStartState[index];
        }
        let generator = new SentenceGenerator_1.SentenceGenerator(this.grammarLexerData.atn);
        return generator.generate(options, start, lexerDefinitions, parserDefinitions);
    }
    lexTestInput(input, actionFile) {
        let result = [];
        let error = "";
        if (this.grammarLexerData) {
            let predicateEvaluator;
            if (actionFile) {
                delete require.cache[require.resolve(actionFile)];
                const { PredicateEvaluator, evaluateLexerPredicate, evaluateParserPredicate } = require(actionFile);
                if (PredicateEvaluator) {
                    predicateEvaluator = new PredicateEvaluator();
                }
                else {
                    predicateEvaluator = {
                        evaluateLexerPredicate: evaluateLexerPredicate,
                        evaluateParserPredicate: evaluateParserPredicate
                    };
                }
            }
            let stream = antlr4ts_1.CharStreams.fromString(input);
            let lexer = new GrammarInterpreters_1.GrammarLexerInterpreter(predicateEvaluator, this, "<unnamed>", this.grammarLexerData, stream);
            lexer.removeErrorListeners();
            lexer.addErrorListener(new GrammarInterpreters_1.InterpreterLexerErrorListener((event, ...args) => {
                error += args[0] + "\n";
                return true;
            }));
            let tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
            tokenStream.fill();
            for (let token of tokenStream.getTokens()) {
                let name = lexer.vocabulary.getSymbolicName(token.type);
                result.push(name);
            }
        }
        return [result, error];
    }
    parseTestInput(input, startRule, actionFile) {
        let errors = [];
        if (!this.grammarLexerData || !this.grammarParserData) {
            return ["No interpreter data available"];
        }
        let predicateEvaluator;
        if (actionFile) {
            delete require.cache[require.resolve(actionFile)];
            const { PredicateEvaluator, evaluateLexerPredicate, evaluateParserPredicate } = require(actionFile);
            if (PredicateEvaluator) {
                predicateEvaluator = new PredicateEvaluator();
            }
            else {
                predicateEvaluator = {
                    evaluateLexerPredicate: evaluateLexerPredicate,
                    evaluateParserPredicate: evaluateParserPredicate
                };
            }
        }
        let eventSink = (event, ...args) => {
            errors.push(args[0]);
        };
        let stream = antlr4ts_1.CharStreams.fromString(input);
        let lexer = new GrammarInterpreters_1.GrammarLexerInterpreter(predicateEvaluator, this, "<unnamed>", this.grammarLexerData, stream);
        lexer.removeErrorListeners();
        lexer.addErrorListener(new GrammarInterpreters_1.InterpreterLexerErrorListener(eventSink));
        let tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
        tokenStream.fill();
        let parser = new GrammarInterpreters_1.GrammarParserInterpreter(eventSink, predicateEvaluator, this, this.grammarParserData, tokenStream);
        parser.buildParseTree = true;
        parser.removeErrorListeners();
        parser.addErrorListener(new GrammarInterpreters_1.InterpreterParserErrorListener(eventSink));
        let startRuleIndex = parser.getRuleIndex(startRule);
        let parseTree = parser.parse(startRuleIndex);
        return errors;
    }
    getSymbolInfo(symbol) {
        return this.symbolTable.getSymbolInfo(symbol);
    }
    resolveSymbol(symbolName) {
        return this.symbolTable.resolve(symbolName, false);
    }
    formatGrammar(options, start, stop) {
        this.tokenStream.fill();
        let tokens = this.tokenStream.getTokens();
        let formatter = new Formatter_1.GrammarFormatter(tokens);
        return formatter.formatGrammar(options, start, stop);
    }
    get isInterpreterDataLoaded() {
        return this.grammarLexerData != undefined || this.grammarParserData != undefined;
    }
    get interpreterData() {
        return [this.grammarLexerData, this.grammarParserData];
    }
    get hasErrors() {
        for (let diagnostic of this.diagnostics) {
            if (diagnostic.type == facade_1.DiagnosticType.Error) {
                return true;
            }
        }
        return false;
    }
    runSemanticAnalysisIfNeeded() {
        if (!this.semanticAnalysisDone) {
            this.semanticAnalysisDone = true;
            this.rrdScripts = new Map();
            let semanticListener = new SemanticListener_1.SemanticListener(this.diagnostics, this.symbolTable);
            tree_1.ParseTreeWalker.DEFAULT.walk(semanticListener, this.tree);
            let visitor = new RuleVisitor_1.RuleVisitor(this.rrdScripts);
            visitor.visit(this.tree);
        }
    }
    setupInterpreters(outputDir) {
        let lexerFile = "";
        let parserFile = "";
        let baseName = (this.fileName.endsWith(".g4") ? path.basename(this.fileName, ".g4") : path.basename(this.fileName, ".g"));
        let grammarPath = (outputDir) ? outputDir : path.dirname(this.fileName);
        switch (this.grammarType) {
            case GrammarType.Combined: {
                parserFile = path.join(grammarPath, baseName) + ".interp";
                if (baseName.endsWith("Parser")) {
                    baseName = baseName.substr(0, baseName.length - "Parser".length);
                }
                lexerFile = path.join(grammarPath, baseName) + "Lexer.interp";
                break;
            }
            case GrammarType.Lexer: {
                lexerFile = path.join(grammarPath, baseName) + ".interp";
                break;
            }
            case GrammarType.Parser: {
                parserFile = path.join(grammarPath, baseName) + ".interp";
                break;
            }
            default:
                break;
        }
        if (fs.existsSync(lexerFile)) {
            this.grammarLexerData = InterpreterDataReader_1.InterpreterDataReader.parseFile(lexerFile);
            let map = new Map();
            for (let i = 0; i < this.grammarLexerData.ruleNames.length; ++i) {
                map.set(this.grammarLexerData.ruleNames[i], i);
            }
            this.grammarLexerRuleMap = map;
        }
        else {
            this.grammarLexerData = undefined;
            this.grammarLexerRuleMap.clear();
        }
        if (fs.existsSync(parserFile)) {
            this.grammarParserData = InterpreterDataReader_1.InterpreterDataReader.parseFile(parserFile);
            let map = new Map();
            for (let i = 0; i < this.grammarParserData.ruleNames.length; ++i) {
                map.set(this.grammarParserData.ruleNames[i], i);
            }
            this.grammarParserRuleMap = map;
        }
        else {
            this.grammarParserData = undefined;
            this.grammarParserRuleMap.clear();
        }
    }
    intervalSetToStrings(set) {
        let result = [];
        function characterRepresentation(char) {
            if (char < 0) {
                return "EOF";
            }
            if ((char >= 0x21 && char <= 0x7F) || (char >= 0xA1 && char <= 0xFF)) {
                return "'" + String.fromCharCode(char) + "'";
            }
            return "\\u" + char.toString(16).toUpperCase();
        }
        for (let interval of set.intervals) {
            let entry = characterRepresentation(interval.a);
            if (interval.a !== interval.b) {
                entry += " - " + characterRepresentation(interval.b);
            }
            result.push(entry);
        }
        return result;
    }
    static getKindFromSymbol(symbol) {
        if (symbol.name === "tokenVocab") {
            return facade_1.SymbolKind.TokenVocab;
        }
        let kind = this.symbolToKindMap.get(symbol.constructor);
        if (kind == facade_1.SymbolKind.Action && symbol.isPredicate) {
            return facade_1.SymbolKind.Predicate;
        }
        return kind;
    }
    static definitionForContext(ctx, keepQuotes) {
        if (!ctx) {
            return undefined;
        }
        var result = {
            text: "",
            range: {
                start: { column: 0, row: 0 },
                end: { column: 0, row: 0 }
            }
        };
        if (ctx instanceof antlr4ts_1.ParserRuleContext) {
            let range = { a: ctx.start.startIndex, b: ctx.stop.stopIndex };
            result.range.start.column = ctx.start.charPositionInLine;
            result.range.start.row = ctx.start.line;
            result.range.end.column = ctx.stop.charPositionInLine;
            result.range.end.row = ctx.stop.line;
            if (ctx.ruleIndex == ANTLRv4Parser_1.ANTLRv4Parser.RULE_modeSpec) {
                let modeSpec = ctx;
                range.b = modeSpec.SEMI().symbol.stopIndex;
                result.range.end.column = modeSpec.SEMI().symbol.charPositionInLine;
                result.range.end.row = modeSpec.SEMI().symbol.line;
            }
            else if (ctx.ruleIndex == ANTLRv4Parser_1.ANTLRv4Parser.RULE_grammarSpec) {
                let grammarSpec = ctx;
                range.b = grammarSpec.SEMI().symbol.stopIndex;
                result.range.end.column = grammarSpec.SEMI().symbol.charPositionInLine;
                result.range.end.row = grammarSpec.SEMI().symbol.line;
                range.a = grammarSpec.grammarType().start.startIndex;
                result.range.start.column = grammarSpec.grammarType().start.charPositionInLine;
                result.range.start.row = grammarSpec.grammarType().start.line;
            }
            let cs = ctx.start.tokenSource.inputStream;
            result.text = cs.getText(range);
        }
        else if (ctx instanceof tree_1.TerminalNode) {
            result.text = ctx.text;
            result.range.start.column = ctx.symbol.charPositionInLine;
            result.range.start.row = ctx.symbol.line;
            result.range.end.column = ctx.symbol.charPositionInLine + result.text.length;
            result.range.end.row = ctx.symbol.line;
        }
        if (keepQuotes || result.text.length < 2)
            return result;
        let quoteChar = result.text[0];
        if ((quoteChar == '"' || quoteChar == '`' || quoteChar == '\'') && quoteChar == result.text[result.text.length - 1])
            result.text = result.text.substr(1, result.text.length - 2);
        return result;
    }
}
SourceContext.symbolToKindMap = new Map([
    [ContextSymbolTable_1.ImportSymbol, facade_1.SymbolKind.Import],
    [ContextSymbolTable_1.BuiltInTokenSymbol, facade_1.SymbolKind.BuiltInLexerToken],
    [ContextSymbolTable_1.VirtualTokenSymbol, facade_1.SymbolKind.VirtualLexerToken],
    [ContextSymbolTable_1.FragmentTokenSymbol, facade_1.SymbolKind.FragmentLexerToken],
    [ContextSymbolTable_1.TokenSymbol, facade_1.SymbolKind.LexerToken],
    [ContextSymbolTable_1.BuiltInModeSymbol, facade_1.SymbolKind.BuiltInMode],
    [ContextSymbolTable_1.LexerModeSymbol, facade_1.SymbolKind.LexerMode],
    [ContextSymbolTable_1.BuiltInChannelSymbol, facade_1.SymbolKind.BuiltInChannel],
    [ContextSymbolTable_1.TokenChannelSymbol, facade_1.SymbolKind.TokenChannel],
    [ContextSymbolTable_1.RuleSymbol, facade_1.SymbolKind.ParserRule],
    [ContextSymbolTable_1.ActionSymbol, facade_1.SymbolKind.Action],
    [ContextSymbolTable_1.OperatorSymbol, facade_1.SymbolKind.Operator],
    [ContextSymbolTable_1.TokenReferenceSymbol, facade_1.SymbolKind.TokenReference],
    [ContextSymbolTable_1.RuleReferenceSymbol, facade_1.SymbolKind.RuleReference]
]);
SourceContext.globalSymbols = new ContextSymbolTable_1.ContextSymbolTable("Global Symbols", { allowDuplicateSymbols: false });
exports.SourceContext = SourceContext;
;
function parseTreeFromPosition(root, column, row) {
    if (root instanceof tree_1.TerminalNode) {
        let terminal = root;
        let token = terminal.symbol;
        if (token.line != row)
            return undefined;
        let tokenStop = token.charPositionInLine + (token.stopIndex - token.startIndex + 1);
        if (token.charPositionInLine <= column && tokenStop >= column) {
            return terminal;
        }
        return undefined;
    }
    else {
        let context = root;
        if (!context.start || !context.stop) {
            return undefined;
        }
        if (context.start.line > row || (context.start.line == row && column < context.start.charPositionInLine)) {
            return undefined;
        }
        let tokenStop = context.stop.charPositionInLine + (context.stop.stopIndex - context.stop.startIndex + 1);
        if (context.stop.line < row || (context.stop.line == row && tokenStop < column)) {
            return undefined;
        }
        if (context.children) {
            for (let child of context.children) {
                let result = parseTreeFromPosition(child, column, row);
                if (result) {
                    return result;
                }
            }
        }
        return context;
    }
}
//# sourceMappingURL=SourceContext.js.map