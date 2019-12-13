'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Utils_1 = require("./Utils");
const vscode_1 = require("vscode");
class WebviewProvider {
    constructor(backend, context) {
        this.backend = backend;
        this.context = context;
        this.webViewMap = new Map();
    }
    showWebview(source, options) {
        this.currentEditor = (source instanceof vscode_1.Uri) ? undefined : source;
        let uri = (source instanceof vscode_1.Uri) ? source : source.document.uri;
        let uriString = uri.toString();
        if (this.webViewMap.has(uriString)) {
            let [panel, _] = this.webViewMap.get(uriString);
            panel.title = options.title;
            if (!this.updateContent(uri)) {
                panel.webview.html = this.generateContent(panel.webview, this.currentEditor ? this.currentEditor : uri, options);
            }
            return;
        }
        let panel = vscode_1.window.createWebviewPanel('antlr4-vscode-webview', options.title, vscode_1.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this.webViewMap.set(uriString, [panel, options]);
        panel.webview.html = this.generateContent(panel.webview, this.currentEditor ? this.currentEditor : uri, options);
        panel.onDidDispose(() => {
            this.webViewMap.delete(uriString);
        }, null, this.context.subscriptions);
        panel.webview.onDidReceiveMessage(message => {
            if (this.handleMessage(message)) {
                return;
            }
            switch (message.command) {
                case "alert": {
                    vscode_1.window.showErrorMessage(message.text);
                    return;
                }
                case "saveSVG": {
                    let css = [];
                    css.push(Utils_1.Utils.getMiscPath("light.css", this.context));
                    let customStyles = vscode_1.workspace.getConfiguration("antlr4")['customcss'];
                    if (customStyles && Array.isArray(customStyles)) {
                        for (let style of customStyles) {
                            css.push(style);
                        }
                    }
                    let svg = '<?xml version="1.0" standalone="no"?>\n';
                    for (let stylesheet of css) {
                        svg += `<?xml-stylesheet href="${path.basename(stylesheet)}" type="text/css"?>\n`;
                    }
                    svg += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' +
                        '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + message.svg;
                    try {
                        Utils_1.Utils.exportDataWithConfirmation(path.join(vscode_1.workspace.getConfiguration("antlr4." + message.type)["saveDir"] || "", message.name + "." + message.type), { "SVG": ["svg"] }, svg, css);
                    }
                    catch (error) {
                        vscode_1.window.showErrorMessage("Couldn't write SVG file: " + error);
                    }
                    break;
                }
                case "saveHTML": {
                    let css = [];
                    css.push(Utils_1.Utils.getMiscPath("light.css", this.context));
                    css.push(Utils_1.Utils.getMiscPath("dark.css", this.context));
                    let customStyles = vscode_1.workspace.getConfiguration("antlr4")['customcss'];
                    if (customStyles && Array.isArray(customStyles)) {
                        for (let style of customStyles) {
                            css.push(style);
                        }
                    }
                    try {
                        Utils_1.Utils.exportDataWithConfirmation(path.join(vscode_1.workspace.getConfiguration("antlr4." + message.type)["saveDir"] || "", message.name + "." + message.type), { "HTML": ["html"] }, message.html, css);
                    }
                    catch (error) {
                        vscode_1.window.showErrorMessage("Couldn't write HTML file: " + error);
                    }
                    break;
                }
            }
        }, undefined, this.context.subscriptions);
    }
    generateContent(webView, source, options) {
        return "";
    }
    generateContentSecurityPolicy(_) {
        return `<meta http-equiv="Content-Security-Policy" content="default-src 'self';
            script-src vscode-resource: 'self' 'unsafe-inline' 'unsafe-eval' https:;
            style-src vscode-resource: 'self' 'unsafe-inline';
            img-src vscode-resource: 'self' "/>
        `;
    }
    updateContent(uri) {
        return false;
    }
    update(editor) {
        if (this.webViewMap.has(editor.document.uri.toString())) {
            let [panel, options] = this.webViewMap.get(editor.document.uri.toString());
            if (!this.updateContent(editor.document.uri)) {
                panel.webview.html = this.generateContent(panel.webview, editor, options);
            }
        }
    }
    sendMessage(uri, args) {
        if (this.webViewMap.has(uri.toString())) {
            let [panel, _] = this.webViewMap.get(uri.toString());
            panel.webview.postMessage(args);
            return true;
        }
        return false;
    }
    handleMessage(message) {
        return false;
    }
    getStyles(webView) {
        const baseStyles = [
            Utils_1.Utils.getMiscPath("light.css", this.context, webView),
            Utils_1.Utils.getMiscPath("dark.css", this.context, webView)
        ];
        let defaults = baseStyles.map(link => `<link rel="stylesheet" type="text/css" href="${link}">`).join('\n');
        const paths = vscode_1.workspace.getConfiguration("antlr4")['customcss'];
        if (paths && Array.isArray(paths) && paths.length > 0) {
            return defaults + "\n" + paths.map(path => `<link rel="stylesheet" href="${webView.asWebviewUri(path)}" type="text/css" media="screen">`).join('\n');
        }
        return defaults;
    }
    getScripts(nonce, scripts) {
        return scripts
            .map(source => `<script type="text/javascript" src="${source}" nonce="${nonce}"></script>`).join('\n');
    }
    findCurrentRule(editor) {
        let fileName = editor.document.uri.fsPath;
        let caret = editor.selection.active;
        let result = this.backend.ruleFromPosition(fileName, caret.character, caret.line + 1);
        if (!result)
            return [undefined, undefined];
        return result;
    }
}
exports.WebviewProvider = WebviewProvider;
//# sourceMappingURL=WebviewProvider.js.map