import { TreeItem, TreeItemCollapsibleState, Command, ProviderResult } from "vscode";
import { AntlrTreeDataProvider } from "./AntlrTreeDataProvider";
export declare class ParserSymbolsProvider extends AntlrTreeDataProvider<ParserSymbol> {
    getChildren(element?: ParserSymbol): ProviderResult<ParserSymbol[]>;
}
export declare class ParserSymbol extends TreeItem {
    readonly label: string;
    readonly collapsibleState: TreeItemCollapsibleState;
    constructor(label: string, collapsibleState: TreeItemCollapsibleState, command_?: Command);
    iconPath: {
        light: string;
        dark: string;
    };
    contextValue: string;
}
