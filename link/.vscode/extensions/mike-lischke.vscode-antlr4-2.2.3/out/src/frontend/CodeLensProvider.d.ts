import { CodeLensProvider, TextDocument, CancellationToken, CodeLens, Event } from "vscode";
import { AntlrFacade } from "../backend/facade";
export declare class AntlrCodeLensProvider implements CodeLensProvider {
    private backend;
    private _onDidChangeCodeLenses;
    readonly onDidChangeCodeLenses: Event<void>;
    constructor(backend: AntlrFacade);
    refresh(): void;
    provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]>;
    resolveCodeLens(codeLens: CodeLens, token: CancellationToken): CodeLens | Thenable<CodeLens>;
    private documentName;
}
