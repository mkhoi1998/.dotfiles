import { TextDocument, CancellationToken, SymbolInformation, DocumentSymbolProvider } from 'vscode';
import { ProviderResult } from 'vscode';
import { AntlrFacade } from "../backend/facade";
export declare class AntlrSymbolProvider implements DocumentSymbolProvider {
    private backend;
    constructor(backend: AntlrFacade);
    provideDocumentSymbols(document: TextDocument, token: CancellationToken): ProviderResult<SymbolInformation[]>;
}
