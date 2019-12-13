import { ATN, RuleStartState } from "antlr4ts/atn";
import { SentenceGenerationOptions, RuleMappings } from "./facade";
export declare class SentenceGenerator {
    private lexerATN;
    constructor(lexerATN: ATN);
    generate(options: SentenceGenerationOptions, start: RuleStartState, lexerDefinitions?: RuleMappings, parserDefinitions?: RuleMappings): string;
    private generateFromATNSequence;
    private generateFromDecisionState;
    private getRandomDecision;
    private loopEnd;
    private blockStart;
    private getIntervalElement;
    private getRandomCharacterFromInterval;
    private printableUnicode;
    private convergenceFactor;
    private lexerDecisionCounts;
    private parserDecisionCounts;
    private maxIterations;
    private lexerDefinitions;
    private parserDefinitions;
    private parserStack;
    private parserStack2;
}
