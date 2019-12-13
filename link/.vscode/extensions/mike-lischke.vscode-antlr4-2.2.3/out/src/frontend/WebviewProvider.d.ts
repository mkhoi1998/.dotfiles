import { AntlrFacade } from "../backend/facade";
import { TextEditor, ExtensionContext, Uri, Webview } from "vscode";
export interface WebviewShowOptions {
    title: string;
    [key: string]: boolean | number | string;
}
export declare class WebviewProvider {
    protected backend: AntlrFacade;
    protected context: ExtensionContext;
    protected currentRule: string | undefined;
    protected currentRuleIndex: number | undefined;
    protected currentEditor: TextEditor | undefined;
    constructor(backend: AntlrFacade, context: ExtensionContext);
    showWebview(source: TextEditor | Uri, options: WebviewShowOptions): void;
    protected generateContent(webView: Webview, source: TextEditor | Uri, options: WebviewShowOptions): string;
    protected generateContentSecurityPolicy(_: TextEditor | Uri): string;
    protected updateContent(uri: Uri): boolean;
    update(editor: TextEditor): void;
    protected sendMessage(uri: Uri, args: any): boolean;
    protected handleMessage(message: any): boolean;
    protected getStyles(webView: Webview): string;
    protected getScripts(nonce: string, scripts: string[]): string;
    protected findCurrentRule(editor: TextEditor): [string | undefined, number | undefined];
    private webViewMap;
}
