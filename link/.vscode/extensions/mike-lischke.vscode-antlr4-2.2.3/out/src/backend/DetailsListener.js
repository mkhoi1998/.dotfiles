"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ANTLRv4Parser_1 = require("../parser/ANTLRv4Parser");
const ContextSymbolTable_1 = require("./ContextSymbolTable");
const SourceContext_1 = require("./SourceContext");
const antlr4_c3_1 = require("antlr4-c3");
class DetailsListener {
    constructor(symbolTable, imports) {
        this.symbolTable = symbolTable;
        this.imports = imports;
    }
    enterLexerRuleSpec(ctx) {
        let tokenRef = ctx.TOKEN_REF();
        if (tokenRef) {
            if (ctx.FRAGMENT()) {
                this.currentSymbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.FragmentTokenSymbol, undefined, tokenRef.text);
                this.currentSymbol.context = ctx;
            }
            else {
                this.currentSymbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.TokenSymbol, undefined, tokenRef.text);
                this.currentSymbol.context = ctx;
            }
        }
    }
    enterParserRuleSpec(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.RuleSymbol, undefined, ctx.RULE_REF().text);
        this.currentSymbol.context = ctx;
    }
    exitParserRuleSpec(ctx) {
        let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.TokenSymbol, this.currentSymbol, ";");
        try {
            symbol.context = ctx.SEMI();
        }
        catch (e) {
        }
        if (this.currentSymbol) {
            this.currentSymbol = this.currentSymbol.parent;
        }
    }
    enterRuleBlock(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(antlr4_c3_1.BlockSymbol, this.currentSymbol, "");
    }
    exitRuleBlock(ctx) {
        if (this.currentSymbol) {
            this.currentSymbol = this.currentSymbol.parent;
        }
    }
    enterLexerRuleBlock(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(antlr4_c3_1.BlockSymbol, this.currentSymbol, "");
    }
    exitLexerRuleBlock(ctx) {
        if (this.currentSymbol) {
            this.currentSymbol = this.currentSymbol.parent;
        }
    }
    enterBlock(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(antlr4_c3_1.BlockSymbol, this.currentSymbol, "");
        this.currentSymbol.context = ctx;
    }
    exitBlock(ctx) {
        if (this.currentSymbol) {
            this.currentSymbol = this.currentSymbol.parent;
        }
    }
    enterAlternative(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.AlternativeSymbol, this.currentSymbol, "");
        this.currentSymbol.context = ctx;
    }
    exitAlternative(ctx) {
        if (this.currentSymbol) {
            this.currentSymbol = this.currentSymbol.parent;
        }
    }
    enterLexerAlt(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.AlternativeSymbol, this.currentSymbol, "");
        this.currentSymbol.context = ctx;
    }
    exitLexerAlt(ctx) {
        if (this.currentSymbol) {
            this.currentSymbol = this.currentSymbol.parent;
        }
    }
    enterTokensSpec(ctx) {
        let idList = ctx.idList();
        if (idList) {
            for (let identifier of idList.identifier()) {
                let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.VirtualTokenSymbol, undefined, identifier.text);
                symbol.context = ctx;
            }
        }
    }
    enterTerminalRule(ctx) {
        if (this.currentSymbol) {
            if (ctx.TOKEN_REF()) {
                let refName = ctx.TOKEN_REF().text;
                let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.TokenReferenceSymbol, this.currentSymbol, refName);
                symbol.context = ctx.TOKEN_REF();
            }
            else {
                let refName = unquote(ctx.STRING_LITERAL().text, "'");
                let symbol = this.symbolTable.addNewSymbolOfType(antlr4_c3_1.LiteralSymbol, this.currentSymbol, refName, refName);
                symbol.context = ctx.STRING_LITERAL();
            }
        }
    }
    enterRuleref(ctx) {
        if (ctx.RULE_REF() && this.currentSymbol) {
            let refName = ctx.RULE_REF().text;
            let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.RuleReferenceSymbol, this.currentSymbol, refName);
            symbol.context = ctx.RULE_REF();
        }
    }
    enterChannelsSpec(ctx) {
        let idList = ctx.idList();
        if (idList) {
            for (let identifier of idList.identifier()) {
                let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.TokenChannelSymbol, undefined, identifier.text);
                symbol.context = ctx;
            }
        }
    }
    exitModeSpec(ctx) {
        let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.LexerModeSymbol, undefined, ctx.identifier().text);
        symbol.context = ctx;
    }
    exitDelegateGrammar(ctx) {
        let context = ctx.identifier()[ctx.identifier().length - 1];
        if (context) {
            let name = SourceContext_1.SourceContext.definitionForContext(context, false).text;
            let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.ImportSymbol, undefined, name);
            symbol.context = ctx;
            this.imports.push(name);
        }
    }
    enterOptionsSpec(ctx) {
        this.currentSymbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.OptionsSymbol, undefined, "options");
        this.currentSymbol.context = ctx;
    }
    exitOption(ctx) {
        let option = ctx.identifier().text;
        let value = ctx.tryGetRuleContext(0, ANTLRv4Parser_1.OptionValueContext);
        if (value) {
            let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.OptionSymbol, this.currentSymbol, option);
            symbol.value = value.text;
            symbol.context = ctx;
            if (option == "tokenVocab") {
                this.imports.push(value.text);
            }
        }
    }
    enterEbnfSuffix(ctx) {
        let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.EbnfSuffixSymbol, this.currentSymbol, ctx.text);
        symbol.context = ctx;
    }
    enterActionBlock(ctx) {
        let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.ActionSymbol, this.currentSymbol, "action");
        symbol.context = ctx;
    }
    enterArgActionBlock(ctx) {
        let symbol = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.ArgumentSymbol, this.currentSymbol, "argument");
        symbol.context = ctx;
    }
    enterLabeledElement(ctx) {
        let symbol = this.symbolTable.addNewSymbolOfType(antlr4_c3_1.VariableSymbol, this.currentSymbol, ctx.identifier().text);
        symbol.context = ctx;
        if (ctx.childCount > 1) {
            let operator = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.OperatorSymbol, this.currentSymbol, ctx.getChild(1).text);
            operator.context = ctx.getChild(1);
        }
    }
    exitElement(ctx) {
        if (ctx.QUESTION() && this.currentSymbol) {
            let child = this.currentSymbol.lastChild;
            if (child instanceof ContextSymbolTable_1.ActionSymbol) {
                child.isPredicate = true;
                let questionMark = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.PredicateMarkerSymbol, this.currentSymbol, '?');
                questionMark.context = ctx.QUESTION();
            }
        }
    }
    exitLexerElement(ctx) {
        if (ctx.QUESTION() && this.currentSymbol) {
            let child = this.currentSymbol.lastChild;
            if (child instanceof ContextSymbolTable_1.ActionSymbol) {
                child.isPredicate = true;
                let questionMark = this.symbolTable.addNewSymbolOfType(ContextSymbolTable_1.PredicateMarkerSymbol, this.currentSymbol, '?');
                questionMark.context = ctx.QUESTION();
            }
        }
    }
}
exports.DetailsListener = DetailsListener;
;
function unquote(input, quoteChar) {
    quoteChar = quoteChar || '\"';
    if (input[0] === quoteChar && input[input.length - 1] === quoteChar)
        return input.slice(1, input.length - 1);
    return input;
}
;
//# sourceMappingURL=DetailsListener.js.map