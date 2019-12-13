/*!
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */
import { ATN } from "antlr4ts/atn";
import { Vocabulary } from "antlr4ts";
export declare class InterpreterData {
    atn: ATN;
    vocabulary: Vocabulary;
    ruleNames: string[];
    channels: string[];
    modes: string[];
}
export declare class InterpreterDataReader {
    static parseFile(fileName: string): InterpreterData;
}
