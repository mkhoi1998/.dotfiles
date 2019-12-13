import { DebugSession } from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol/lib/debugProtocol';
import { Uri } from "vscode";
import { GrammarDebugger } from '../backend/GrammarDebugger';
import { AntlrFacade } from '../backend/facade';
export interface LaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
    input: string;
    startRule: string;
    grammar: string;
    actionFile: string;
    stopOnEntry?: boolean;
    trace?: boolean;
    printParseTree?: boolean;
    visualParseTree?: boolean;
}
export interface DebuggerConsumer {
    debugger: GrammarDebugger;
    refresh(): void;
    debuggerStopped(uri: Uri): void;
}
export declare class AntlrDebugSession extends DebugSession {
    private backend;
    private consumers;
    constructor(backend: AntlrFacade, consumers: DebuggerConsumer[]);
    shutdown(): void;
    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void;
    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void;
    protected launchRequest(response: DebugProtocol.LaunchResponse, args: LaunchRequestArguments): Promise<void>;
    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void;
    protected threadsRequest(response: DebugProtocol.ThreadsResponse): void;
    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void;
    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void;
    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments): void;
    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments): void;
    protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void;
    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void;
    protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments): void;
    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments): void;
    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): void;
    private setup;
    private createSource;
    private parseNodeToString;
    private notifyConsumers;
    private escapeText;
    private static THREAD_ID;
    private debugger;
    private parseTreeProvider;
    private configurationDone;
    private showTextualParseTree;
    private showGraphicalParseTree;
    private testInput;
    private tokens;
    private variables;
}
