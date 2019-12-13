import { TextDocument, Position, CancellationToken, Location, ProviderResult, DefinitionProvider } from 'vscode';
import { AntlrFacade } from '../backend/facade';
export declare class AntlrDefinitionProvider implements DefinitionProvider {
    private backend;
    constructor(backend: AntlrFacade);
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Location>;
}
