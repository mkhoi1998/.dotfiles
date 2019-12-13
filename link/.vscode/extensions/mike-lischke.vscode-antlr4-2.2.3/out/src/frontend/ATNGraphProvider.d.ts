import { WebviewProvider, WebviewShowOptions } from "./WebviewProvider";
import { Uri, TextEditor, Webview } from "vscode";
export declare class ATNStateEntry {
    scale: number;
    translation: {
        x: number;
        y: number;
    };
    states: {
        id: number;
        fx: number;
        fy: number;
    }[];
}
export declare class AntlrATNGraphProvider extends WebviewProvider {
    static atnStates: Map<string, Map<string, ATNStateEntry>>;
    static addStatesForGrammar(root: string, grammar: string): void;
    generateContent(webView: Webview, source: TextEditor | Uri, options: WebviewShowOptions): string;
    update(editor: TextEditor, forced?: boolean): void;
    protected handleMessage(message: any): boolean;
    private cachedRuleStates;
}
