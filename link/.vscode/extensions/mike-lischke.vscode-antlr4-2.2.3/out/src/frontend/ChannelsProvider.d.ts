import { TreeItem, TreeItemCollapsibleState, Command } from "vscode";
import { AntlrTreeDataProvider } from "./AntlrTreeDataProvider";
export declare class ChannelsProvider extends AntlrTreeDataProvider<ChannelEntry> {
    getChildren(element?: ChannelEntry): Thenable<ChannelEntry[]>;
}
export declare class ChannelEntry extends TreeItem {
    readonly label: string;
    readonly collapsibleState: TreeItemCollapsibleState;
    constructor(label: string, collapsibleState: TreeItemCollapsibleState, command_?: Command);
    iconPath: {
        light: string;
        dark: string;
    };
    contextValue: string;
}
