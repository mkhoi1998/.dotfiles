import { TreeItem, TreeItemCollapsibleState, Command, ProviderResult } from "vscode";
import { AntlrTreeDataProvider } from "./AntlrTreeDataProvider";
export declare class ModesProvider extends AntlrTreeDataProvider<ModeEntry> {
    getTreeItem(element: ModeEntry): TreeItem;
    getChildren(element?: ModeEntry): ProviderResult<ModeEntry[]>;
}
export declare class ModeEntry extends TreeItem {
    readonly label: string;
    readonly collapsibleState: TreeItemCollapsibleState;
    constructor(label: string, collapsibleState: TreeItemCollapsibleState, command_?: Command);
    iconPath: {
        light: string;
        dark: string;
    };
    contextValue: string;
}
