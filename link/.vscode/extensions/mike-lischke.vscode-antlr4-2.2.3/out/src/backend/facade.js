"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
var SymbolGroupKind;
(function (SymbolGroupKind) {
    SymbolGroupKind[SymbolGroupKind["TokenRef"] = 0] = "TokenRef";
    SymbolGroupKind[SymbolGroupKind["RuleRef"] = 1] = "RuleRef";
    SymbolGroupKind[SymbolGroupKind["LexerMode"] = 2] = "LexerMode";
    SymbolGroupKind[SymbolGroupKind["TokenChannel"] = 3] = "TokenChannel";
})(SymbolGroupKind = exports.SymbolGroupKind || (exports.SymbolGroupKind = {}));
;
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["Keyword"] = 0] = "Keyword";
    SymbolKind[SymbolKind["TokenVocab"] = 1] = "TokenVocab";
    SymbolKind[SymbolKind["Import"] = 2] = "Import";
    SymbolKind[SymbolKind["BuiltInLexerToken"] = 3] = "BuiltInLexerToken";
    SymbolKind[SymbolKind["VirtualLexerToken"] = 4] = "VirtualLexerToken";
    SymbolKind[SymbolKind["FragmentLexerToken"] = 5] = "FragmentLexerToken";
    SymbolKind[SymbolKind["LexerToken"] = 6] = "LexerToken";
    SymbolKind[SymbolKind["BuiltInMode"] = 7] = "BuiltInMode";
    SymbolKind[SymbolKind["LexerMode"] = 8] = "LexerMode";
    SymbolKind[SymbolKind["BuiltInChannel"] = 9] = "BuiltInChannel";
    SymbolKind[SymbolKind["TokenChannel"] = 10] = "TokenChannel";
    SymbolKind[SymbolKind["ParserRule"] = 11] = "ParserRule";
    SymbolKind[SymbolKind["Action"] = 12] = "Action";
    SymbolKind[SymbolKind["Predicate"] = 13] = "Predicate";
    SymbolKind[SymbolKind["Operator"] = 14] = "Operator";
    SymbolKind[SymbolKind["Option"] = 15] = "Option";
    SymbolKind[SymbolKind["TokenReference"] = 16] = "TokenReference";
    SymbolKind[SymbolKind["RuleReference"] = 17] = "RuleReference";
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
;
const SourceContext_1 = require("./SourceContext");
const GrammarDebugger_1 = require("./GrammarDebugger");
class LexicalRange {
}
exports.LexicalRange = LexicalRange;
class Definition {
}
exports.Definition = Definition;
;
class SymbolInfo {
}
exports.SymbolInfo = SymbolInfo;
;
var DiagnosticType;
(function (DiagnosticType) {
    DiagnosticType[DiagnosticType["Hint"] = 0] = "Hint";
    DiagnosticType[DiagnosticType["Info"] = 1] = "Info";
    DiagnosticType[DiagnosticType["Warning"] = 2] = "Warning";
    DiagnosticType[DiagnosticType["Error"] = 3] = "Error";
})(DiagnosticType = exports.DiagnosticType || (exports.DiagnosticType = {}));
;
class DiagnosticEntry {
}
exports.DiagnosticEntry = DiagnosticEntry;
;
class LexerToken {
}
exports.LexerToken = LexerToken;
;
var ParseTreeNodeType;
(function (ParseTreeNodeType) {
    ParseTreeNodeType[ParseTreeNodeType["Rule"] = 0] = "Rule";
    ParseTreeNodeType[ParseTreeNodeType["Terminal"] = 1] = "Terminal";
    ParseTreeNodeType[ParseTreeNodeType["Error"] = 2] = "Error";
})(ParseTreeNodeType = exports.ParseTreeNodeType || (exports.ParseTreeNodeType = {}));
;
class IndexRange {
}
exports.IndexRange = IndexRange;
;
class ParseTreeNode {
}
exports.ParseTreeNode = ParseTreeNode;
class ReferenceNode {
}
exports.ReferenceNode = ReferenceNode;
;
class HierarchyNode {
}
exports.HierarchyNode = HierarchyNode;
;
var HierarchyNodeType;
(function (HierarchyNodeType) {
    HierarchyNodeType[HierarchyNodeType["Unknown"] = 0] = "Unknown";
    HierarchyNodeType[HierarchyNodeType["File"] = 1] = "File";
    HierarchyNodeType[HierarchyNodeType["Rule"] = 2] = "Rule";
    HierarchyNodeType[HierarchyNodeType["Token"] = 3] = "Token";
    HierarchyNodeType[HierarchyNodeType["Literal"] = 4] = "Literal";
})(HierarchyNodeType = exports.HierarchyNodeType || (exports.HierarchyNodeType = {}));
;
class ATNGraphData {
}
exports.ATNGraphData = ATNGraphData;
;
;
;
;
class ContextEntry {
    constructor() {
        this.dependencies = [];
    }
}
;
class AntlrFacade {
    constructor(importDir) {
        this.importDir = importDir;
        this.sourceContexts = new Map();
    }
    getSelfDiagnostics() {
        return {
            "contextCount": this.sourceContexts.keys.length
        };
    }
    loadDependency(contextEntry, depName) {
        let basePath = path.dirname(contextEntry.grammar);
        let fullPath = path.isAbsolute(this.importDir) ? this.importDir : path.join(basePath, this.importDir);
        try {
            let depPath = fullPath + "/" + depName + ".g4";
            fs.accessSync(depPath, fs.constants.R_OK);
            contextEntry.dependencies.push(depPath);
            return this.loadGrammar(depPath);
        }
        catch (e) {
        }
        try {
            let depPath = fullPath + "/" + depName + ".g";
            fs.accessSync(depPath, fs.constants.R_OK);
            contextEntry.dependencies.push(depPath);
            return this.loadGrammar(depPath);
        }
        catch (e) {
        }
        try {
            let depPath = basePath + "/" + depName + ".g4";
            fs.statSync(depPath);
            contextEntry.dependencies.push(depPath);
            return this.loadGrammar(depPath);
        }
        catch (e) {
        }
        ;
        try {
            let depPath = basePath + "/" + depName + ".g";
            fs.statSync(depPath);
            contextEntry.dependencies.push(depPath);
            return this.loadGrammar(depPath);
        }
        catch (e) {
        }
        ;
        return undefined;
    }
    parseGrammar(contextEntry) {
        let oldDependencies = contextEntry.dependencies;
        contextEntry.dependencies = [];
        let newDependencies = contextEntry.context.parse();
        for (let dep of newDependencies) {
            let depContext = this.loadDependency(contextEntry, dep);
            if (depContext)
                contextEntry.context.addAsReferenceTo(depContext);
        }
        for (let dep of oldDependencies)
            this.releaseGrammar(dep);
    }
    getContext(fileName, source) {
        let contextEntry = this.sourceContexts.get(fileName);
        if (!contextEntry) {
            return this.loadGrammar(fileName, source);
        }
        return contextEntry.context;
    }
    setText(fileName, source) {
        let contextEntry = this.sourceContexts.get(fileName);
        if (contextEntry) {
            contextEntry.context.setText(source);
        }
    }
    reparse(fileName) {
        let contextEntry = this.sourceContexts.get(fileName);
        if (contextEntry) {
            this.parseGrammar(contextEntry);
        }
    }
    loadGrammar(fileName, source) {
        let contextEntry = this.sourceContexts.get(fileName);
        if (!contextEntry) {
            if (!source) {
                try {
                    fs.statSync(fileName);
                    source = fs.readFileSync(fileName, 'utf8');
                }
                catch (e) {
                    source = "";
                }
                ;
            }
            let context = new SourceContext_1.SourceContext(fileName);
            contextEntry = { context: context, refCount: 0, dependencies: [], grammar: fileName };
            this.sourceContexts.set(fileName, contextEntry);
            context.setText(source);
            this.parseGrammar(contextEntry);
        }
        contextEntry.refCount++;
        return contextEntry.context;
    }
    internalReleaseGrammar(fileName, referencing) {
        let contextEntry = this.sourceContexts.get(fileName);
        if (contextEntry) {
            if (referencing) {
                referencing.context.removeDependency(contextEntry.context);
            }
            contextEntry.refCount--;
            if (contextEntry.refCount == 0) {
                this.sourceContexts.delete(fileName);
                for (let dep of contextEntry.dependencies)
                    this.internalReleaseGrammar(dep, contextEntry);
            }
        }
    }
    releaseGrammar(fileName) {
        this.internalReleaseGrammar(fileName);
    }
    symbolInfoAtPosition(fileName, column, row, limitToChildren = true) {
        let context = this.getContext(fileName);
        return context.symbolAtPosition(column, row, limitToChildren);
    }
    ;
    infoForSymbol(fileName, symbol) {
        let context = this.getContext(fileName);
        return context.getSymbolInfo(symbol);
    }
    enclosingSymbolAtPosition(fileName, column, row, ruleScope = false) {
        let context = this.getContext(fileName);
        return context.enclosingSymbolAtPosition(column, row, ruleScope);
    }
    listTopLevelSymbols(fileName, fullList) {
        let context = this.getContext(fileName);
        return context.listTopLevelSymbols(!fullList);
    }
    ;
    getLexerVocabulary(fileName) {
        let context = this.getContext(fileName);
        return context.getVocabulary();
    }
    getRuleList(fileName) {
        let context = this.getContext(fileName);
        return context.getRuleList();
    }
    getChannels(fileName) {
        let context = this.getContext(fileName);
        return context.getChannels();
    }
    getModes(fileName) {
        let context = this.getContext(fileName);
        return context.getModes();
    }
    listActions(fileName) {
        let context = this.getContext(fileName);
        return context.listActions();
    }
    getCodeCompletionCandidates(fileName, column, row) {
        let context = this.getContext(fileName);
        return context.getCodeCompletionCandidates(column, row);
    }
    ;
    getDiagnostics(fileName) {
        let context = this.getContext(fileName);
        return context.getDiagnostics();
    }
    ;
    ruleFromPosition(fileName, column, row) {
        let context = this.getContext(fileName);
        return context.ruleFromPosition(column, row);
    }
    countReferences(fileName, symbol) {
        let context = this.getContext(fileName);
        return context.getReferenceCount(symbol);
    }
    getSymbolOccurences(fileName, symbolName) {
        let context = this.getContext(fileName);
        let result = context.symbolTable.getSymbolOccurences(symbolName, false);
        return result.sort((lhs, rhs) => {
            return lhs.kind - rhs.kind;
        });
    }
    getDependencies(fileName) {
        let entry = this.sourceContexts.get(fileName);
        if (!entry) {
            return [];
        }
        let dependencies = new Set();
        this.pushDependencyFiles(entry, dependencies);
        let result = [];
        for (let dep of dependencies) {
            result.push(dep.fileName);
        }
        return result;
    }
    getReferenceGraph(fileName) {
        let context = this.getContext(fileName);
        return context.getReferenceGraph();
    }
    getRRDScript(fileName, rule) {
        let context = this.getContext(fileName);
        return context.getRRDScript(rule) || "";
    }
    ;
    pushDependencyFiles(entry, contexts) {
        for (let dep of entry.dependencies) {
            let depEntry = this.sourceContexts.get(dep);
            if (depEntry) {
                this.pushDependencyFiles(depEntry, contexts);
                contexts.add(depEntry.context);
            }
        }
    }
    generate(fileName, options) {
        let context = this.getContext(fileName);
        let dependencies = new Set();
        this.pushDependencyFiles(this.sourceContexts.get(fileName), dependencies);
        return context.generate(dependencies, options);
    }
    getATNGraph(fileName, rule) {
        let context = this.getContext(fileName);
        return context.getATNGraph(rule);
    }
    generateSentence(fileName, options, lexerDefinitions, parserDefinitions) {
        let context = this.getContext(fileName);
        return context.generateSentence(options, lexerDefinitions, parserDefinitions);
    }
    lexTestInput(fileName, input, actionFile) {
        let context = this.getContext(fileName);
        return context.lexTestInput(input, actionFile);
    }
    parseTestInput(fileName, input, startRule, actionFile) {
        let context = this.getContext(fileName);
        return context.parseTestInput(input, startRule, actionFile);
    }
    formatGrammar(fileName, options, start, stop) {
        let context = this.getContext(fileName);
        return context.formatGrammar(options, start, stop);
    }
    hasErrors(fileName) {
        let context = this.getContext(fileName);
        return context.hasErrors;
    }
    createDebugger(fileName, actionFile, dataDir) {
        let context = this.getContext(fileName);
        if (!context) {
            return;
        }
        let contexts = new Set();
        contexts.add(context);
        this.pushDependencyFiles(this.sourceContexts.get(fileName), contexts);
        for (let dependency of contexts) {
            if (dependency.hasErrors) {
                return;
            }
            if (!dependency.isInterpreterDataLoaded) {
                dependency.setupInterpreters(dataDir);
            }
        }
        return new GrammarDebugger_1.GrammarDebugger([...contexts], actionFile);
    }
}
exports.AntlrFacade = AntlrFacade;
//# sourceMappingURL=facade.js.map