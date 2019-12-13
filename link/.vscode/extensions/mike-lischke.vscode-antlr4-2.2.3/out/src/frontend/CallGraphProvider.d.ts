import { WebviewProvider, WebviewShowOptions } from "./WebviewProvider";
import { TextEditor, Uri, Webview } from "vscode";
export declare class AntlrCallGraphProvider extends WebviewProvider {
    generateContent(webView: Webview, source: TextEditor | Uri, options: WebviewShowOptions): string;
}
