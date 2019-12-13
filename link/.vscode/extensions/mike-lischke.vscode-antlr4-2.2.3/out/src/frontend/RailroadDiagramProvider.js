'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const facade_1 = require("../backend/facade");
const WebviewProvider_1 = require("./WebviewProvider");
const Utils_1 = require("./Utils");
class AntlrRailroadDiagramProvider extends WebviewProvider_1.WebviewProvider {
    generateContent(webView, editor, options) {
        let caret = editor.selection.active;
        let fileName = editor.document.fileName;
        let [ruleName, ruleIndex] = this.backend.ruleFromPosition(fileName, caret.character, caret.line + 1);
        if (!ruleName) {
            return "";
        }
        let baseName = path.basename(fileName, path.extname(fileName));
        const nonce = new Date().getTime() + '' + new Date().getMilliseconds();
        const scripts = [
            Utils_1.Utils.getMiscPath('utils.js', this.context, webView),
            Utils_1.Utils.getMiscPath("railroad-diagrams.js", this.context, webView)
        ];
        let diagram = `<!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-type" content="text/html; charset=UTF-8"/>
                ${this.generateContentSecurityPolicy(editor)}
                ${this.getStyles(webView)}
                <base href="${editor.document.uri.toString(true)}">
            </head>

            <body>
            ${this.getScripts(nonce, scripts)}
        `;
        if (options.fullList) {
            diagram += `
                <div class="header"><span class="rrd-color"><span class="graph-initial">Ⓡ</span>rd&nbsp;&nbsp;</span>All rules
                    <span class="action-box">
                    Save to HTML<a onClick="exportToHTML('rrd', '${baseName}');"><span class="rrd-save-image" /></a>
                    </span>
                </div>
                <div id="container">`;
            var symbols = this.backend.listTopLevelSymbols(fileName, false);
            for (let symbol of symbols) {
                if (symbol.kind == facade_1.SymbolKind.LexerToken
                    || symbol.kind == facade_1.SymbolKind.ParserRule
                    || symbol.kind == facade_1.SymbolKind.FragmentLexerToken) {
                    let script = this.backend.getRRDScript(fileName, symbol.name);
                    diagram += `<h3>${symbol.name}</h3>\n<script>${script}</script>\n\n`;
                }
            }
            diagram += `</div>`;
        }
        else {
            diagram += `
                <div class="header"><span class="rrd-color"><span class="graph-initial">Ⓡ</span>ule&nbsp;&nbsp;</span>&nbsp;&nbsp;${ruleName} <span class="rule-index">(rule index: ${ruleIndex})</span>
                    <span class="action-box">
                    Save to SVG<a onClick="exportToSVG('rrd', '${ruleName}');"><span class="rrd-save-image" /></a>
                    </span>
                </div>
                <div id="container">
                    <script>${this.backend.getRRDScript(fileName, ruleName)}</script>
                </div>
            `;
        }
        diagram += `</body></html>`;
        return diagram;
    }
}
exports.AntlrRailroadDiagramProvider = AntlrRailroadDiagramProvider;
;
//# sourceMappingURL=RailroadDiagramProvider.js.map