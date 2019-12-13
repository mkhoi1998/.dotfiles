import { TreeItem, Command, TextEditor, TreeView, ProviderResult } from "vscode";
import { AntlrTreeDataProvider } from "./AntlrTreeDataProvider";
import { LexicalRange } from "../backend/facade";
export declare class ActionsProvider extends AntlrTreeDataProvider<TreeItem> {
    actionTree: TreeView<TreeItem>;
    update(editor: TextEditor): void;
    getParent?(element: TreeItem): ProviderResult<TreeItem>;
    getChildren(element?: TreeItem): ProviderResult<TreeItem[]>;
    private actionsTreeItem;
    private predicatesTreeItem;
    private actions;
    private predicates;
}
export declare class RootEntry extends TreeItem {
    constructor(label: string, id: string);
    contextValue: string;
}
export declare class ActionEntry extends TreeItem {
    range: LexicalRange;
    constructor(label: string, range: LexicalRange, command_?: Command);
    contextValue: string;
}
export declare class PredicateEntry extends TreeItem {
    range: LexicalRange;
    constructor(label: string, range: LexicalRange, command_?: Command);
    contextValue: string;
}
