import * as vscode from "vscode";
import { WebviewProvider, WebviewShowOptions } from "./WebviewProvider";
import { DebuggerConsumer } from "./AntlrDebugAdapter";
import { GrammarDebugger } from "../backend/GrammarDebugger";
import { Webview } from "vscode";
export declare class AntlrParseTreeProvider extends WebviewProvider implements DebuggerConsumer {
    debugger: GrammarDebugger;
    refresh(): void;
    debuggerStopped(uri: vscode.Uri): void;
    generateContent(webView: Webview, uri: vscode.Uri, options: WebviewShowOptions): string;
    protected updateContent(uri: vscode.Uri): boolean;
}
