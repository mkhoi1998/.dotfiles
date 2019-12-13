'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const WebviewProvider_1 = require("./WebviewProvider");
const Utils_1 = require("./Utils");
const vscode_1 = require("vscode");
class ATNStateEntry {
}
exports.ATNStateEntry = ATNStateEntry;
;
class AntlrATNGraphProvider extends WebviewProvider_1.WebviewProvider {
    static addStatesForGrammar(root, grammar) {
        let hash = Utils_1.Utils.hashForPath(grammar);
        let atnCacheFile = path.join(root, "cache", hash + ".atn");
        if (fs.existsSync(atnCacheFile)) {
            let data = fs.readFileSync(atnCacheFile, { encoding: "utf-8" });
            let fileEntry = new Map(JSON.parse(data));
            AntlrATNGraphProvider.atnStates.set(hash, fileEntry);
        }
    }
    generateContent(webView, source, options) {
        if (!this.currentRule) {
            return `<!DOCTYPE html>
                <html>
                    <head>
                        ${this.generateContentSecurityPolicy(source)}
                    </head>
                    <body><span style="color: #808080; font-size: 16pt;">No rule selected</span></body>
                </html>`;
        }
        let html = fs.readFileSync(Utils_1.Utils.getMiscPath("atngraph-head.html", this.context), { encoding: "utf-8" });
        let code = fs.readFileSync(Utils_1.Utils.getMiscPath("atngraph.js", this.context), { encoding: "utf-8" });
        const scripts = [
            Utils_1.Utils.getMiscPath('utils.js', this.context, webView),
        ];
        let uri = (source instanceof vscode_1.Uri) ? source : source.document.uri;
        html = html.replace("##header##", `
            ${this.generateContentSecurityPolicy(source)}
            ${this.getStyles(webView)}
            <base target="_blank" />
        `.replace(/\$/g, "$$"));
        let graphLibPath = Utils_1.Utils.getNodeModulesPath('d3/dist/d3.js', this.context);
        html = html.replace("##d3path##", graphLibPath);
        html = html.replace(/##objectName##/g, this.currentRule.replace(/\$/g, "$$"));
        html = html.replace(/##index##/g, this.currentRuleIndex ? "" + this.currentRuleIndex : "?");
        let maxLabelCount = vscode_1.workspace.getConfiguration("antlr4.atn")["maxLabelCount"];
        html = html.replace("##maxLabelCount##", maxLabelCount > 1 ? maxLabelCount : 5);
        html += `  var width = 1000, height = 1000;\n\n`;
        let data = this.backend.getATNGraph(uri.fsPath, this.currentRule);
        if (data) {
            let scale = !this.cachedRuleStates || Number.isNaN(this.cachedRuleStates.scale)
                ? "0.5 * Math.exp(-nodes.length / 50) + 0.1"
                : this.cachedRuleStates.scale;
            let transX = !this.cachedRuleStates || !this.cachedRuleStates.translation.x || Number.isNaN(this.cachedRuleStates.translation.x)
                ? "width * (1 - initialScale)"
                : this.cachedRuleStates.translation.x.toString();
            let transY = !this.cachedRuleStates || !this.cachedRuleStates.translation.y || Number.isNaN(this.cachedRuleStates.translation.y)
                ? "height * (1 - initialScale)"
                : this.cachedRuleStates.translation.y.toString();
            if (this.cachedRuleStates) {
                for (let node of data.nodes) {
                    let state = this.cachedRuleStates.states.find(function (element) {
                        return element.id === node.id;
                    });
                    if (state) {
                        if (state.fx) {
                            node["fx"] = state.fx;
                        }
                        if (state.fy) {
                            node["fy"] = state.fy;
                        }
                    }
                }
            }
            html += "  var nodes = " + JSON.stringify(data.nodes) + "\n";
            html += "  var links = " + JSON.stringify(data.links) + "\n\n";
            html += `  var initialScale = ${scale};\n`;
            html += `  var initialTranslateX = ${transX};\n`;
            html += `  var initialTranslateY = ${transY};\n`;
            const nonce = new Date().getTime() + '' + new Date().getMilliseconds();
            html += `${code}\n</script>\n${this.getScripts(nonce, scripts)}</div></body>`;
        }
        else {
            html += "  var nodes = []\n";
            html += "  var links = []\n\n";
            html += `  var initialScale = 1;\n`;
            html += `  var initialTranslateX = 0;\n`;
            html += `  var initialTranslateY = 0;\n`;
            html += `</script><br/><span style="color: #808080; font-size: 16pt;">No ATN data found
                    (code generation must run at least once in internal or external mode)</span></div></body>`;
        }
        return html + "</html>";
    }
    ;
    update(editor, forced = false) {
        let [currentRule, ruleIndex] = this.findCurrentRule(editor);
        if (!this.currentEditor || this.currentEditor !== editor || this.currentRule !== currentRule || forced) {
            let hash = Utils_1.Utils.hashForPath(editor.document.fileName);
            let cachedStates = AntlrATNGraphProvider.atnStates.get(hash);
            if (!cachedStates || !currentRule) {
                this.cachedRuleStates = undefined;
            }
            else {
                this.cachedRuleStates = cachedStates.get(currentRule);
            }
            if (this.currentEditor) {
                if (this.sendMessage(editor.document.uri, {
                    command: "cacheATNLayout",
                    file: editor.document.fileName,
                    rule: this.currentRule
                })) {
                    this.currentEditor = editor;
                    this.currentRule = currentRule;
                    this.currentRuleIndex = ruleIndex;
                    super.update(editor);
                }
                ;
            }
            else {
                this.currentEditor = editor;
                this.currentRule = currentRule;
                this.currentRuleIndex = ruleIndex;
                super.update(editor);
            }
        }
    }
    handleMessage(message) {
        if (message.command == "saveATNState") {
            let hash = Utils_1.Utils.hashForPath(message.file);
            let basePath = path.dirname(message.file);
            let atnCachePath = path.join(basePath, ".antlr/cache");
            let fileEntry = AntlrATNGraphProvider.atnStates.get(hash);
            if (!fileEntry) {
                fileEntry = new Map();
            }
            let scale = 1;
            let translateX = 0;
            let translateY = 0;
            let temp = message.transform.split(/[(), ]/);
            for (let i = 0; i < temp.length; ++i) {
                if (temp[i] === "translate") {
                    translateX = Number(temp[++i]);
                    translateY = Number(temp[++i]);
                }
                else if (temp[i] === "scale") {
                    scale = Number(temp[++i]);
                }
            }
            let ruleEntry = { scale: scale, translation: { x: translateX / scale, y: translateY / scale }, states: [] };
            for (let node of message.nodes) {
                ruleEntry.states.push({ id: node.id, fx: node.fx, fy: node.fy });
            }
            fileEntry.set(message.rule, ruleEntry);
            AntlrATNGraphProvider.atnStates.set(hash, fileEntry);
            fs.ensureDirSync(atnCachePath);
            try {
                fs.writeFileSync(path.join(atnCachePath, hash + ".atn"), JSON.stringify(Array.from(fileEntry)), { encoding: "utf-8" });
            }
            catch (error) {
                vscode_1.window.showErrorMessage("Couldn't write ATN state data for: " + message.file + "(" + hash + ")");
            }
            return true;
        }
        return false;
    }
}
AntlrATNGraphProvider.atnStates = new Map();
exports.AntlrATNGraphProvider = AntlrATNGraphProvider;
;
//# sourceMappingURL=ATNGraphProvider.js.map