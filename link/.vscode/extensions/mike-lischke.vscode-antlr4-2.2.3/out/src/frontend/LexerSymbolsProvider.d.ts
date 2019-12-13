import { TreeItem, TreeItemCollapsibleState, Command, ProviderResult } from "vscode";
import { AntlrTreeDataProvider } from "./AntlrTreeDataProvider";
export declare class LexerSymbolsProvider extends AntlrTreeDataProvider<LexerSymbol> {
    getChildren(element?: LexerSymbol): ProviderResult<LexerSymbol[]>;
}
export declare class LexerSymbol extends TreeItem {
    readonly label: string;
    readonly collapsibleState: TreeItemCollapsibleState;
    constructor(label: string, collapsibleState: TreeItemCollapsibleState, command_?: Command);
    iconPath: {
        light: string;
        dark: string;
    };
    contextValue: string;
}
