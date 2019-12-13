import { TextDocument, Position, CancellationToken, Hover, ProviderResult, HoverProvider } from 'vscode';
import { AntlrFacade } from "../backend/facade";
export declare class AntlrHoverProvider implements HoverProvider {
    private backend;
    constructor(backend: AntlrFacade);
    provideHover(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Hover>;
}
