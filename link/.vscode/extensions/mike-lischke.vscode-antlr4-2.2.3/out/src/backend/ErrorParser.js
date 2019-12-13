"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const facade_1 = require("../backend/facade");
class ErrorParser {
    constructor(contexts) {
        this.contexts = contexts;
        contexts.forEach(context => {
            context.diagnostics.length = 0;
        });
    }
    convertErrorsToDiagnostics(text) {
        let lines = text.split("\n");
        for (let line of lines) {
            if (line.length > 0) {
                let matches = ErrorParser.errorPattern.exec(line);
                if (!matches) {
                    return false;
                }
                else {
                    let fileName = matches[3];
                    let context;
                    for (let candidate of this.contexts) {
                        if (candidate.fileName === fileName || candidate.fileName.endsWith(fileName)) {
                            context = candidate;
                            break;
                        }
                    }
                    if (!context) {
                        continue;
                    }
                    let errorCode = Number(matches[2]);
                    let errorText = matches[6];
                    if (matches[4].length > 0) {
                        let range = {
                            start: { row: Number(matches[4]), column: Number(matches[5]) },
                            end: { row: Number(matches[4]), column: Number(matches[5]) + 1 }
                        };
                        switch (errorCode) {
                            case 8:
                            case 56:
                            case 57:
                            case 63:
                            case 64:
                            case 65:
                            case 66:
                            case 67:
                            case 75:
                            case 79:
                            case 84:
                            case 94:
                            case 105:
                            case 106:
                            case 108:
                            case 110:
                            case 111:
                            case 113:
                            case 118:
                            case 122:
                            case 123:
                            case 125:
                            case 126:
                            case 128:
                            case 130:
                            case 131:
                            case 132:
                            case 133:
                            case 134:
                            case 135:
                            case 136:
                            case 137:
                            case 138:
                            case 139:
                            case 140:
                            case 141:
                            case 142:
                            case 143:
                            case 144:
                            case 145:
                            case 146:
                            case 147:
                            case 148:
                            case 149:
                            case 150:
                            case 151:
                            case 153:
                            case 154:
                            case 155:
                            case 156:
                            case 158:
                            case 159:
                            case 160:
                            case 161:
                            case 162:
                            case 169:
                            case 170:
                            case 171:
                            case 172:
                            case 173:
                            case 174:
                            case 175:
                            case 176:
                            case 177:
                            case 178:
                            case 179:
                            case 180:
                            case 181:
                            case 182: {
                                let matches = ErrorParser.errorCodeToPattern.get(errorCode).exec(errorText);
                                if (matches) {
                                    if (matches.length > 2) {
                                        let symbols = [];
                                        for (let i = 1; i < symbols.length; ++i) {
                                            symbols.push(matches[i]);
                                        }
                                        ;
                                        this.addDiagnosticsForSymbols(symbols, errorText, facade_1.DiagnosticType.Error, context);
                                        continue;
                                    }
                                    range.end.column += matches[1].length - 1;
                                }
                                break;
                            }
                            case 50: {
                                let matches = /\(missing '[^']+'\)?[^']+'([^']+)'/.exec(errorText);
                                if (matches) {
                                    range.end.column += matches[1].length - 1;
                                }
                                break;
                            }
                            case 69:
                            case 70:
                            case 72:
                            case 73:
                            case 74:
                            case 76:
                            case 80:
                            case 124: {
                                let matches = ErrorParser.errorCodeToPattern.get(errorCode).exec(errorText);
                                if (matches) {
                                    this.addDiagnosticsForSymbols([matches[1]], errorText, facade_1.DiagnosticType.Warning, context);
                                    range.end.column += matches[1].length - 1;
                                }
                                break;
                            }
                            case 83: {
                                let matches = /unsupported option (\w+)/.exec(errorText);
                                if (matches) {
                                    range.end.column += matches[1].length - 1;
                                }
                                break;
                            }
                            case 105: {
                                let matches = /reference: (\w+).(\w+)/.exec(errorText);
                                if (matches) {
                                    range.end.column += matches[1].length + matches[2].length;
                                }
                                break;
                            }
                            case 109:
                                range.end.column += "options".length - 1;
                                break;
                            case 202: {
                                let enclosingRange = context.enclosingSymbolAtPosition(range.start.column, range.start.row, true);
                                if (enclosingRange && enclosingRange.definition) {
                                    range = enclosingRange.definition.range;
                                }
                                break;
                            }
                            case 157:
                                range.end.column += "assoc".length - 1;
                                break;
                            case 204:
                                range.end.column += 7;
                                break;
                            case 205:
                                range.end.column += 1;
                                break;
                            default: {
                                let info = context.symbolAtPosition(range.start.column, range.start.row, false);
                                if (info) {
                                    range.end.column += info.name.length - 1;
                                }
                                break;
                            }
                        }
                        let error = {
                            type: (matches[1] == "error") ? facade_1.DiagnosticType.Error : facade_1.DiagnosticType.Warning,
                            message: errorText,
                            range: range
                        };
                        context.diagnostics.push(error);
                    }
                    else {
                        switch (errorCode) {
                            case 1:
                            case 2:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 9:
                            case 10:
                            case 11:
                            case 20:
                            case 21:
                            case 22:
                            case 30:
                            case 31:
                            case 32:
                            case 33:
                            case 34:
                            case 35:
                            case 54:
                            case 99:
                                this.addGenericDiagnosis(errorText, facade_1.DiagnosticType.Error, context);
                                break;
                            case 119: {
                                let matches = /\[([^\]]+)]/.exec(errorText);
                                if (matches) {
                                    let symbols = matches[1].split(",");
                                    this.addDiagnosticsForSymbols(symbols, errorText, facade_1.DiagnosticType.Error, context);
                                }
                                break;
                            }
                            case 180: {
                                break;
                            }
                            default:
                                this.addGenericDiagnosis(`[Internal Error] Unhandled error message (code ${errorCode}, message: ${errorText}\n"
								  "Please file a bug report at https://github.com/mike-lischke/vscode-antlr4/issues)`, facade_1.DiagnosticType.Error, context);
                                break;
                        }
                    }
                }
            }
        }
        return true;
    }
    addDiagnosticsForSymbols(symbols, text, type, context) {
        for (let symbol of symbols) {
            let info = context.getSymbolInfo(symbol.trim());
            if (info) {
                let error = {
                    type: type,
                    message: text,
                    range: info.definition.range
                };
                context.diagnostics.push(error);
            }
        }
    }
    addGenericDiagnosis(text, type, context) {
        let error = {
            type: type,
            message: text,
            range: { start: { column: 0, row: 1 }, end: { column: 0, row: 1 } }
        };
        context.diagnostics.push(error);
    }
}
ErrorParser.errorPattern = /(\w+)\s*\((\d+)\):\s*([^:]*):(\d*):(\d*):\s*(.+)/;
ErrorParser.errorCodeToPattern = new Map([
    [8, /grammar name (\w+)/],
    [56, /:\s+(\w+)/],
    [57, /rule (\w+) in non-local ref (\w+)/],
    [63, /reference (\w+) in (\w+)/],
    [64, /parameter (\w+) of rule (\w+) is not accessible in this scope: (\w+)/],
    [65, /attribute (\w+) for rule (\w+) in (\w+)/],
    [66, /attribute (\w+) isn't a valid property in (\w+)/],
    [67, /reference (\w+) in (\w+)/],
    [69, /label (\w+)/],
    [70, /label (\w+)/],
    [72, /label (\w+)/],
    [73, /label (\w+)/],
    [74, /label (\w+)/],
    [75, /label (\w+)[^:]+: (\w+)/],
    [76, /value (\w+)/],
    [79, /reference: (\w+)/],
    [80, /rule (\w+)/],
    [84, /value (\w+)/],
    [94, /of (\w+)/],
    [106, /rule (\w+)/],
    [108, /name (\w+)/],
    [110, /grammar (\w+)/],
    [111, /import \w+ grammar (\w+)/],
    [113, /import \w+ grammar (\w+)/],
    [160, /file (\w+)/],
    [118, /alt (\w+)/],
    [122, /rule (\w+)/],
    [123, /alt label (\w+) redefined in rule (\w+), originally in rule (\w+)/],
    [124, /label (\w+) conflicts with rule (\w+)/],
    [125, /of token (\w+)/],
    [126, /grammar: (\w+)/],
    [128, /actions: (\$\w+)/],
    [130, /label (\w+)/],
    [131, /block \(\)(\w+)/],
    [132, /rule (\w+)/],
    [133, /rule (\w+)/],
    [134, /symbol (\w+)/],
    [135, /label (\w+)/],
    [136, /value (\w+)/],
    [137, /value (\w+)/],
    [138, /parameter (\w+)/],
    [139, /parameter (\w+)/],
    [140, /local (\w+)/],
    [141, /local (\w+)/],
    [142, /local (\w+)/],
    [143, /local (\w+)/],
    [144, /sets: (\w+)/],
    [145, /mode (\w+)/],
    [146, /rule (\w+)/],
    [147, /rule (\w+)/],
    [148, /rule (\w+)/],
    [149, /command (\w+)/],
    [150, /command (\w+)/],
    [151, /command (\w+)/],
    [153, /rule (\w+)/],
    [154, /rule (\w+)/],
    [155, /rule (\w+)/],
    [156, /sequence (\w+)/],
    [158, /rule (\w+)/],
    [159, /name (\w+)/],
    [161, /channel (\w+)/],
    [162, /channel (\w+)/],
    [169, /rule (\w+)/],
    [170, /mode (\w+)/],
    [171, /name (\w+)/],
    [172, /name (\w+)/],
    [173, /name (\w+)/],
    [174, /empty: (\w+)/],
    [175, /(\w+) is not/],
    [176, /(\w+) is not/],
    [177, /(\w+) is not/],
    [178, /command (\w+)/],
    [179, /commands (\w+)/],
    [180, /used multiple times in set (.+)/],
    [181, /parser: ('[^']+'\.\.'[^']+')/],
    [182, /range: (\w+)/],
]);
exports.ErrorParser = ErrorParser;
;
//# sourceMappingURL=ErrorParser.js.map