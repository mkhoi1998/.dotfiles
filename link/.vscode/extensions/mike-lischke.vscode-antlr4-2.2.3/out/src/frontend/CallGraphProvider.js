'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const WebviewProvider_1 = require("./WebviewProvider");
const Utils_1 = require("./Utils");
const vscode_1 = require("vscode");
class AntlrCallGraphProvider extends WebviewProvider_1.WebviewProvider {
    generateContent(webView, source, options) {
        let uri = (source instanceof vscode_1.Uri) ? source : source.document.uri;
        let fileName = uri.fsPath;
        let baseName = path.basename(fileName, path.extname(fileName));
        let graph = this.backend.getReferenceGraph(fileName);
        let data = [];
        for (let entry of graph) {
            let references = [];
            for (let ref of entry[1].rules) {
                references.push(ref);
            }
            for (let ref of entry[1].tokens) {
                references.push(ref);
            }
            data.push({ name: entry[0], references: references });
        }
        const nonce = new Date().getTime() + '' + new Date().getMilliseconds();
        const scripts = [
            Utils_1.Utils.getMiscPath('utils.js', this.context, webView),
            Utils_1.Utils.getMiscPath("call-graph.js", this.context, webView)
        ];
        let graphLibPath = Utils_1.Utils.getNodeModulesPath('d3/dist/d3.js', this.context);
        let diagram = `<!DOCTYPE html>
            <html>
                <head>
                    <meta http-equiv="Content-type" content="text/html;charset=UTF-8"/>
                    ${this.generateContentSecurityPolicy(source)}
                    ${this.getStyles(webView)}
                    <base href="${uri.toString(true)}">
                    <script src="${graphLibPath}"></script>
                    <script>
                        var data = ${JSON.stringify(data)};
                    </script>
                    ${this.getScripts(nonce, scripts)}
                </head>

            <body>
                <div class="header"><span class="call-graph-color"><span class="graph-initial">Ⓒ</span>all Graph</span>
                    <span class="action-box">
                        <a onClick="changeDiameter(0.8);"><span class="call-graph-color" style="font-size: 120%; font-weight: 800; cursor: pointer; vertical-align: middle;">-</span></a>
                        <span style="margin-left: -5px; margin-right: -5px; cursor: default;">Change radius</span>
                        <a onClick="changeDiameter(1.2);"><span class="call-graph-color" style="font-size: 120%; font-weight: 800; cursor: pointer; vertical-align: middle;">+</span></a>&nbsp;
                        Save to SVG<a onClick="exportToSVG('call-graph', '${baseName}');"><span class="call-graph-save-image" /></a>
                    </span>
                </div>

                <div id="container">
                    <svg></svg>
                </div>
                <script>render();</script>
            </body>
        </html>`;
        return diagram;
    }
    ;
}
exports.AntlrCallGraphProvider = AntlrCallGraphProvider;
;
//# sourceMappingURL=CallGraphProvider.js.map