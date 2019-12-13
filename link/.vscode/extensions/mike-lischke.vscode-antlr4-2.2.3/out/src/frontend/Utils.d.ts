import { ExtensionContext, Webview } from "vscode";
export declare class Utils {
    static getMiscPath(file: string, context: ExtensionContext, webView?: Webview): string;
    static getNodeModulesPath(file: string, context: ExtensionContext): string;
    static isAbsolute(p: string): boolean;
    static deleteFolderRecursive(path: string): void;
    static hashForPath(dataPath: string): string;
    static copyFilesIfNewer(files: string[], targetPath: string): void;
    static exportDataWithConfirmation(fileName: string, filters: {
        [name: string]: string[];
    }, data: string, extraFiles: string[]): void;
    static findInListFromPosition(list: any[], column: number, row: number): any | undefined;
}
