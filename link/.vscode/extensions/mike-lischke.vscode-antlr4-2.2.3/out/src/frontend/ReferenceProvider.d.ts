import { TextDocument, Position, Location, CancellationToken, ProviderResult, ReferenceProvider, ReferenceContext } from 'vscode';
import { AntlrFacade } from '../backend/facade';
export declare class AntlrReferenceProvider implements ReferenceProvider {
    private backend;
    constructor(backend: AntlrFacade);
    provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
}
