"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const antlr4ts_1 = require("antlr4ts");
const CompatibleATNDeserializer_1 = require("./CompatibleATNDeserializer");
class InterpreterData {
}
exports.InterpreterData = InterpreterData;
;
class InterpreterDataReader {
    static parseFile(fileName) {
        let result = new InterpreterData();
        result.ruleNames = [];
        result.channels = [];
        result.modes = [];
        let step = 0;
        let literalNames = [];
        let symbolicNames = [];
        let source = fs.readFileSync(fileName, 'utf8');
        let lines = source.split("\n");
        let index = 0;
        let line = lines[index++];
        if (line !== "token literal names:") {
            throw new Error("Unexpected data entry");
        }
        do {
            line = lines[index++];
            if (line.length == 0) {
                break;
            }
            literalNames.push(line === "null" ? "" : line);
        } while (true);
        line = lines[index++];
        if (line !== "token symbolic names:") {
            throw new Error("Unexpected data entry");
        }
        do {
            line = lines[index++];
            if (line.length == 0) {
                break;
            }
            symbolicNames.push(line === "null" ? "" : line);
        } while (true);
        result.vocabulary = new antlr4ts_1.VocabularyImpl(literalNames, symbolicNames, []);
        line = lines[index++];
        if (line !== "rule names:") {
            throw new Error("Unexpected data entry");
        }
        do {
            line = lines[index++];
            if (line.length == 0) {
                break;
            }
            result.ruleNames.push(line);
        } while (true);
        line = lines[index++];
        if (line === "channel names:") {
            do {
                line = lines[index++];
                if (line.length == 0) {
                    break;
                }
                result.channels.push(line);
            } while (true);
            line = lines[index++];
            if (line !== "mode names:") {
                throw new Error("Unexpected data entry");
            }
            do {
                line = lines[index++];
                if (line.length == 0) {
                    break;
                }
                result.modes.push(line);
            } while (true);
        }
        ;
        line = lines[index++];
        if (line !== "atn:") {
            throw new Error("Unexpected data entry");
        }
        line = lines[index++];
        let elements = line.split(",");
        let value;
        let serializedATN = new Uint16Array(elements.length);
        for (let i = 0; i < elements.length; ++i) {
            let element = elements[i];
            if (element.startsWith("["))
                value = Number(element.substring(1).trim());
            else if (element.endsWith("]"))
                value = Number(element.substring(0, element.length - 1).trim());
            else
                value = Number(element.trim());
            serializedATN[i] = value;
        }
        let deserializer = new CompatibleATNDeserializer_1.CompatibleATNDeserializer();
        result.atn = deserializer.deserialize(serializedATN);
        return result;
    }
}
exports.InterpreterDataReader = InterpreterDataReader;
;
//# sourceMappingURL=InterpreterDataReader.js.map