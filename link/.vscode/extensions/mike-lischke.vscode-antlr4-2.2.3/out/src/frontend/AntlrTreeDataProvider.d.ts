import { TreeDataProvider, TreeItem, TextDocument, ProviderResult } from "vscode";
import { AntlrFacade } from "../backend/facade";
export declare class AntlrTreeDataProvider<T> implements TreeDataProvider<T> {
    protected backend: AntlrFacade;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: import("vscode").Event<T>;
    constructor(backend: AntlrFacade);
    refresh(document: TextDocument): void;
    getTreeItem(element: T): TreeItem;
    getChildren(element?: T): ProviderResult<T[]>;
    protected currentFile: string | undefined;
}
