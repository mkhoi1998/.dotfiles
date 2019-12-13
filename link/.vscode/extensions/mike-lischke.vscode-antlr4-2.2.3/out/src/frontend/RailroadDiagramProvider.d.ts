import * as vscode from "vscode";
import { WebviewProvider, WebviewShowOptions } from "./WebviewProvider";
import { Webview } from "vscode";
export declare class AntlrRailroadDiagramProvider extends WebviewProvider {
    generateContent(webView: Webview, editor: vscode.TextEditor, options: WebviewShowOptions): string;
}
