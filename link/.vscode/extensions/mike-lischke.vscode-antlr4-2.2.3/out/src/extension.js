'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const Net = require("net");
const vscode_1 = require("vscode");
const HoverProvider_1 = require("./frontend/HoverProvider");
const DefinitionProvider_1 = require("./frontend/DefinitionProvider");
const SymbolProvider_1 = require("./frontend/SymbolProvider");
const CodeLensProvider_1 = require("./frontend/CodeLensProvider");
const CompletionItemProvider_1 = require("./frontend/CompletionItemProvider");
const RailroadDiagramProvider_1 = require("./frontend/RailroadDiagramProvider");
const ATNGraphProvider_1 = require("./frontend/ATNGraphProvider");
const FormattingProvider_1 = require("./frontend/FormattingProvider");
const CallGraphProvider_1 = require("./frontend/CallGraphProvider");
const ImportsProvider_1 = require("./frontend/ImportsProvider");
const LexerSymbolsProvider_1 = require("./frontend/LexerSymbolsProvider");
const ParserSymbolsProvider_1 = require("./frontend/ParserSymbolsProvider");
const ChannelsProvider_1 = require("./frontend/ChannelsProvider");
const ModesProvider_1 = require("./frontend/ModesProvider");
const ActionsProvider_1 = require("./frontend/ActionsProvider");
const ParseTreeProvider_1 = require("./frontend/ParseTreeProvider");
const RenameProvider_1 = require("./frontend/RenameProvider");
const ProgressIndicator_1 = require("./frontend/ProgressIndicator");
const AntlrDebugAdapter_1 = require("./frontend/AntlrDebugAdapter");
const facade_1 = require("./backend/facade");
const ReferenceProvider_1 = require("./frontend/ReferenceProvider");
const ANTLR = { language: 'antlr', scheme: 'file' };
let diagnosticCollection = vscode_1.languages.createDiagnosticCollection('antlr');
let DiagnosticTypeMap = new Map();
let backend;
let progress;
let outputChannel;
let importsProvider;
let lexerSymbolsProvider;
let parserSymbolsProvider;
let channelsProvider;
let modesProvider;
let actionsProvider;
let parseTreeProvider;
let codeLensProvider;
function activate(context) {
    DiagnosticTypeMap.set(facade_1.DiagnosticType.Hint, vscode_1.DiagnosticSeverity.Hint);
    DiagnosticTypeMap.set(facade_1.DiagnosticType.Info, vscode_1.DiagnosticSeverity.Information);
    DiagnosticTypeMap.set(facade_1.DiagnosticType.Warning, vscode_1.DiagnosticSeverity.Warning);
    DiagnosticTypeMap.set(facade_1.DiagnosticType.Error, vscode_1.DiagnosticSeverity.Error);
    backend = new facade_1.AntlrFacade(vscode_1.workspace.getConfiguration("antlr4.generation")["importDir"] || "");
    progress = new ProgressIndicator_1.ProgressIndicator();
    outputChannel = vscode_1.window.createOutputChannel("ANTLR Exceptions");
    for (let document of vscode_1.workspace.textDocuments) {
        if (document.languageId === "antlr") {
            let antlrPath = path.join(path.dirname(document.fileName), ".antlr");
            backend.generate(document.fileName, { outputDir: antlrPath, loadOnly: true });
            ATNGraphProvider_1.AntlrATNGraphProvider.addStatesForGrammar(antlrPath, document.fileName);
        }
    }
    context.subscriptions.push(vscode_1.languages.registerHoverProvider(ANTLR, new HoverProvider_1.AntlrHoverProvider(backend)));
    context.subscriptions.push(vscode_1.languages.registerDefinitionProvider(ANTLR, new DefinitionProvider_1.AntlrDefinitionProvider(backend)));
    context.subscriptions.push(vscode_1.languages.registerDocumentSymbolProvider(ANTLR, new SymbolProvider_1.AntlrSymbolProvider(backend)));
    codeLensProvider = new CodeLensProvider_1.AntlrCodeLensProvider(backend);
    context.subscriptions.push(vscode_1.languages.registerCodeLensProvider(ANTLR, codeLensProvider));
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider(ANTLR, new CompletionItemProvider_1.AntlrCompletionItemProvider(backend), " ", ":", "@", "<", "{", "["));
    context.subscriptions.push(vscode_1.languages.registerDocumentRangeFormattingEditProvider(ANTLR, new FormattingProvider_1.AntlrFormattingProvider(backend)));
    context.subscriptions.push(vscode_1.languages.registerRenameProvider(ANTLR, new RenameProvider_1.AntlrRenameProvider(backend)));
    context.subscriptions.push(vscode_1.languages.registerReferenceProvider(ANTLR, new ReferenceProvider_1.AntlrReferenceProvider(backend)));
    let diagramProvider = new RailroadDiagramProvider_1.AntlrRailroadDiagramProvider(backend, context);
    context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('antlr.rrd.singleRule', (editor, edit) => {
        diagramProvider.showWebview(editor, {
            title: "RRD: " + path.basename(editor.document.fileName),
            fullList: false
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('antlr.rrd.allRules', (editor, edit) => {
        diagramProvider.showWebview(editor, {
            title: "RRD: " + path.basename(editor.document.fileName),
            fullList: true
        });
    }));
    let atnGraphProvider = new ATNGraphProvider_1.AntlrATNGraphProvider(backend, context);
    context.subscriptions.push(vscode_1.commands.registerTextEditorCommand("antlr.atn.singleRule", (editor, edit) => {
        atnGraphProvider.showWebview(editor, {
            title: "ATN: " + path.basename(editor.document.fileName)
        });
    }));
    let callGraphProvider = new CallGraphProvider_1.AntlrCallGraphProvider(backend, context);
    context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('antlr.call-graph', (editor, edit) => {
        callGraphProvider.showWebview(editor, {
            title: "Call Graph: " + path.basename(editor.document.fileName)
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerTextEditorCommand("antlr.tools.generateSentences", (editor, edit) => {
        return vscode_1.workspace.openTextDocument(editor.document.uri).then(doc => vscode_1.window.showTextDocument(doc, editor.viewColumn + 1));
    }));
    context.subscriptions.push(vscode_1.debug.registerDebugConfigurationProvider('antlr-debug', new AntlrDebugConfigurationProvider()));
    importsProvider = new ImportsProvider_1.ImportsProvider(backend);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider("antlr4.imports", importsProvider));
    lexerSymbolsProvider = new LexerSymbolsProvider_1.LexerSymbolsProvider(backend);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider("antlr4.lexerSymbols", lexerSymbolsProvider));
    parserSymbolsProvider = new ParserSymbolsProvider_1.ParserSymbolsProvider(backend);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider("antlr4.parserSymbols", parserSymbolsProvider));
    channelsProvider = new ChannelsProvider_1.ChannelsProvider(backend);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider("antlr4.channels", channelsProvider));
    modesProvider = new ModesProvider_1.ModesProvider(backend);
    context.subscriptions.push(vscode_1.window.registerTreeDataProvider("antlr4.modes", modesProvider));
    actionsProvider = new ActionsProvider_1.ActionsProvider(backend);
    actionsProvider.actionTree = vscode_1.window.createTreeView("antlr4.actions", { treeDataProvider: actionsProvider });
    parseTreeProvider = new ParseTreeProvider_1.AntlrParseTreeProvider(backend, context);
    let editor = vscode_1.window.activeTextEditor;
    if (editor && editor.document.languageId == "antlr" && editor.document.uri.scheme === "file") {
        updateTreeProviders(editor.document);
    }
    context.subscriptions.push(vscode_1.commands.registerCommand("antlr.openGrammar", (grammar) => {
        vscode_1.workspace.openTextDocument(grammar).then((document) => {
            vscode_1.window.showTextDocument(document, 0, false);
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand("antlr.selectGrammarRange", (range) => {
        if (vscode_1.window.activeTextEditor) {
            vscode_1.window.activeTextEditor.selection = new vscode_1.Selection(range.start.row - 1, range.start.column, range.end.row - 1, range.end.column + 1);
            vscode_1.window.activeTextEditor.revealRange(new vscode_1.Range(range.start.row - 1, range.start.column, range.end.row - 1, range.end.column + 1), vscode_1.TextEditorRevealType.InCenterIfOutsideViewport);
        }
    }));
    vscode_1.workspace.onDidOpenTextDocument((doc) => {
        if (doc.languageId == "antlr" && doc.uri.scheme === "file") {
            backend.loadGrammar(doc.fileName);
            regenerateBackgroundData(doc);
        }
    });
    vscode_1.workspace.onDidCloseTextDocument((document) => {
        if (document.languageId === "antlr" && document.uri.scheme === "file") {
            backend.releaseGrammar(document.fileName);
            diagnosticCollection.set(document.uri, []);
        }
    });
    let changeTimers = new Map();
    vscode_1.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length > 0
            && event.document.languageId === "antlr"
            && event.document.uri.scheme === "file") {
            let fileName = event.document.fileName;
            backend.setText(fileName, event.document.getText());
            if (changeTimers.has(fileName)) {
                clearTimeout(changeTimers.get(fileName));
            }
            changeTimers.set(fileName, setTimeout(() => {
                changeTimers.delete(fileName);
                backend.reparse(fileName);
                diagramProvider.update(vscode_1.window.activeTextEditor);
                callGraphProvider.update(vscode_1.window.activeTextEditor);
                processDiagnostic(event.document);
                codeLensProvider.refresh();
            }, 300));
        }
    });
    vscode_1.workspace.onDidSaveTextDocument((document) => {
        if (document.languageId === "antlr" && document.uri.scheme === "file") {
            regenerateBackgroundData(document);
        }
    });
    vscode_1.window.onDidChangeTextEditorSelection((event) => {
        if (event.textEditor.document.languageId === "antlr" && event.textEditor.document.uri.scheme === "file") {
            diagramProvider.update(event.textEditor);
            atnGraphProvider.update(event.textEditor, false);
            actionsProvider.update(event.textEditor);
        }
    });
    vscode_1.window.onDidChangeActiveTextEditor((editor) => {
        updateTreeProviders(editor.document);
    });
    function processDiagnostic(document) {
        var diagnostics = [];
        let entries = backend.getDiagnostics(document.fileName);
        for (let entry of entries) {
            let startRow = entry.range.start.row == 0 ? 0 : entry.range.start.row - 1;
            let endRow = entry.range.end.row == 0 ? 0 : entry.range.end.row - 1;
            let range = new vscode_1.Range(startRow, entry.range.start.column, endRow, entry.range.end.column);
            var diagnostic = new vscode_1.Diagnostic(range, entry.message, DiagnosticTypeMap.get(entry.type));
            diagnostics.push(diagnostic);
        }
        diagnosticCollection.set(document.uri, diagnostics);
    }
    function regenerateBackgroundData(document) {
        if (vscode_1.workspace.getConfiguration("antlr4.generation")["mode"] === "none") {
            return;
        }
        let externalMode = vscode_1.workspace.getConfiguration("antlr4.generation")["mode"] === "external";
        progress.startAnimation();
        let basePath = path.dirname(document.fileName);
        let antlrPath = path.join(basePath, ".antlr");
        let outputDir = antlrPath;
        if (externalMode) {
            outputDir = vscode_1.workspace.getConfiguration("antlr4.generation")["outputDir"];
            if (!outputDir) {
                outputDir = basePath;
            }
            else {
                if (!path.isAbsolute(outputDir)) {
                    outputDir = path.join(basePath, outputDir);
                }
            }
        }
        try {
            fs.ensureDirSync(outputDir);
        }
        catch (error) {
            progress.stopAnimation();
            vscode_1.window.showErrorMessage("Cannot create output folder: " + error);
            return;
        }
        let options = {
            baseDir: basePath,
            libDir: vscode_1.workspace.getConfiguration("antlr4.generation")["importDir"],
            outputDir: outputDir,
            listeners: false,
            visitors: false
        };
        if (externalMode) {
            options.language = vscode_1.workspace.getConfiguration("antlr4.generation")["language"];
            options.package = vscode_1.workspace.getConfiguration("antlr4.generation")["package"];
            options.listeners = vscode_1.workspace.getConfiguration("antlr4.generation")["listeners"];
            options.visitors = vscode_1.workspace.getConfiguration("antlr4.generation")["visitors"];
        }
        let result = backend.generate(document.fileName, options);
        result.then((affectedFiles) => {
            for (let file of affectedFiles) {
                let fullPath = path.resolve(basePath, file);
                vscode_1.workspace.textDocuments.forEach(document => {
                    if (document.fileName === fullPath) {
                        processDiagnostic(document);
                    }
                });
            }
            if (externalMode && antlrPath != outputDir) {
                try {
                    let files = fs.readdirSync(outputDir);
                    for (let file of files) {
                        if (file.endsWith(".interp")) {
                            let sourceFile = path.join(outputDir, file);
                            fs.moveSync(sourceFile, path.join(antlrPath, file), { overwrite: true });
                        }
                    }
                }
                catch (error) {
                    vscode_1.window.showErrorMessage("Error while transfering interpreter data: " + error);
                }
            }
            backend.generate(document.fileName, { outputDir: antlrPath, loadOnly: true }).then(() => {
                atnGraphProvider.update(vscode_1.window.activeTextEditor, true);
                updateTreeProviders(document);
                progress.stopAnimation();
            });
        }).catch(error => {
            progress.stopAnimation();
            outputChannel.appendLine(error);
            outputChannel.show(true);
        });
    }
    function updateTreeProviders(document) {
        lexerSymbolsProvider.refresh(document);
        parserSymbolsProvider.refresh(document);
        importsProvider.refresh(document);
        channelsProvider.refresh(document);
        modesProvider.refresh(document);
        actionsProvider.refresh(document);
    }
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
class AntlrDebugConfigurationProvider {
    constructor() { }
    resolveDebugConfiguration(folder, config, token) {
        if (vscode_1.workspace.getConfiguration("antlr4.generation")["mode"] === "none") {
            return vscode_1.window.showErrorMessage("Interpreter data generation is disabled in the preferences (see " +
                "'antlr4.generation'). Set this at least to 'internal' to enable debugging.").then(_ => {
                return undefined;
            });
        }
        if (!config.type || !config.request || !config.name) {
            return vscode_1.window.showErrorMessage("Create a launch configuration for debugging of ANTLR grammars first.").then(_ => {
                return undefined;
            });
        }
        if (!config.input) {
            return vscode_1.window.showErrorMessage("No test input file specified").then(_ => {
                return undefined;
            });
        }
        else {
            if (!path.isAbsolute(config.input) && folder) {
                config.input = path.join(folder.uri.fsPath, config.input);
            }
            if (!fs.existsSync(config.input)) {
                return vscode_1.window.showErrorMessage("Cannot read test input file: " + config.input).then(_ => {
                    return undefined;
                });
            }
        }
        if (config.actionFile) {
            if (!path.isAbsolute(config.actionFile) && folder) {
                config.actionFile = path.join(folder.uri.fsPath, config.actionFile);
            }
        }
        if (!config.grammar) {
            const editor = vscode_1.window.activeTextEditor;
            if (editor && editor.document.languageId === 'antlr') {
                let diagnostics = diagnosticCollection.get(editor.document.uri);
                if (diagnostics && diagnostics.length > 0) {
                    return vscode_1.window.showErrorMessage("Cannot lauch grammar debugging. There are errors in the code.").then(_ => {
                        return undefined;
                    });
                }
                config.grammar = editor.document.fileName;
            }
            else {
                vscode_1.window.showInformationMessage("The ANTLR4 debugger can only be started for ANTLR4 grammars.");
            }
        }
        else {
            if (!path.isAbsolute(config.grammar) && folder) {
                config.grammar = path.join(folder.uri.fsPath, config.grammar);
            }
            if (!fs.existsSync(config.grammar)) {
                return vscode_1.window.showErrorMessage("Cannot read grammar file: " + config.grammar).then(_ => {
                    return undefined;
                });
            }
        }
        if (!config.grammar) {
            return undefined;
        }
        if (!this.server) {
            this.server = Net.createServer(socket => {
                socket.on('end', () => {
                });
                const session = new AntlrDebugAdapter_1.AntlrDebugSession(backend, [
                    parseTreeProvider
                ]);
                session.setRunAsServer(true);
                session.start(socket, socket);
            }).listen(0);
        }
        let info = this.server.address();
        if (info) {
            config.debugServer = info.port;
        }
        else {
            config.debugServer = 0;
        }
        return config;
    }
    dispose() {
        if (this.server) {
            this.server.close();
        }
    }
}
//# sourceMappingURL=extension.js.map