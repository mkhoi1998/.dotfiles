import { SourceContext } from "./SourceContext";
export declare class ErrorParser {
    private contexts;
    private static errorPattern;
    private static errorCodeToPattern;
    constructor(contexts: Set<SourceContext>);
    convertErrorsToDiagnostics(text: string): boolean;
    private addDiagnosticsForSymbols;
    private addGenericDiagnosis;
}
