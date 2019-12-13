import * as vscode from 'vscode';
import { SymbolKind } from '../backend/facade';
export declare function symbolDescriptionFromEnum(kind: SymbolKind): string;
export declare function translateSymbolKind(kind: SymbolKind): vscode.SymbolKind;
export declare function translateCompletionKind(kind: SymbolKind): vscode.CompletionItemKind;
