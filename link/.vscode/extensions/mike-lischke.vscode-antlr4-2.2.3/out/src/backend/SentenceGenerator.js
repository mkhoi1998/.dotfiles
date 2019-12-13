"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atn_1 = require("antlr4ts/atn");
const misc_1 = require("antlr4ts/misc");
const Unicode_1 = require("./Unicode");
class SentenceGenerator {
    constructor(lexerATN) {
        this.lexerATN = lexerATN;
        this.lexerDefinitions = new Map();
        this.parserDefinitions = new Map();
        this.parserStack = [];
        this.parserStack2 = [];
        this.printableUnicode = Unicode_1.printableUnicodePoints({ excludeCJK: true, excludeRTL: true, limitToBMP: false });
    }
    generate(options, start, lexerDefinitions, parserDefinitions) {
        this.convergenceFactor = options.convergenceFactor || 0.25;
        this.maxIterations = (!options.maxIterations || options.maxIterations < 0) ? 1 : options.maxIterations;
        this.lexerDefinitions.clear();
        if (lexerDefinitions) {
            this.lexerDefinitions = lexerDefinitions;
        }
        this.parserDefinitions.clear();
        if (parserDefinitions) {
            this.parserDefinitions = parserDefinitions;
        }
        this.lexerDecisionCounts = new Map();
        this.parserDecisionCounts = new Map();
        this.parserStack.length = 0;
        return this.generateFromATNSequence(start, start.stopState, true).trim();
    }
    generateFromATNSequence(start, stop, addSpace) {
        let inLexer = start.atn == this.lexerATN;
        if (start.stateType == atn_1.ATNStateType.RULE_START) {
            let mapping;
            if (inLexer) {
                mapping = this.lexerDefinitions.get(start.ruleIndex);
            }
            else {
                mapping = this.parserDefinitions.get(start.ruleIndex);
            }
            if (mapping) {
                return mapping;
            }
        }
        let result = "";
        let run = start;
        while (run != stop) {
            switch (run.stateType) {
                case atn_1.ATNStateType.BLOCK_START: {
                    result += this.generateFromDecisionState(run, !inLexer);
                    run = run.endState;
                    break;
                }
                case atn_1.ATNStateType.PLUS_BLOCK_START: {
                    let loopBack = run.loopBackState;
                    let count = Math.floor(Math.random() * (this.maxIterations - 1)) + 1;
                    for (let i = 0; i < count; ++i) {
                        result += this.generateFromATNSequence(run.transition(0).target, loopBack, !inLexer);
                        result += this.generateFromDecisionState(run, !inLexer);
                    }
                    run = loopBack.transition(1).target;
                    break;
                }
                case atn_1.ATNStateType.STAR_LOOP_ENTRY: {
                    let slEntry = run;
                    let blockStart = this.blockStart(slEntry);
                    if (blockStart) {
                        let count = Math.floor(Math.random() * this.maxIterations);
                        for (let i = 0; i < count; ++i) {
                            result += this.generateFromATNSequence(blockStart, slEntry.loopBackState, !inLexer);
                        }
                    }
                    run = this.loopEnd(slEntry) || stop;
                    break;
                }
                default: {
                    let transition = run.transition(0);
                    switch (transition.serializationType) {
                        case 3: {
                            run = transition.followState;
                            let ruleStart = transition.target;
                            result += this.generateFromATNSequence(ruleStart, ruleStart.stopState, !inLexer);
                            break;
                        }
                        case 9: {
                            if (inLexer) {
                                result += this.getRandomCharacterFromInterval(Unicode_1.FULL_UNICODE_SET);
                            }
                            else {
                                let ruleIndex = Math.floor(Math.random() * this.lexerATN.ruleToStartState.length);
                                let state = this.lexerATN.ruleToStartState[ruleIndex];
                                result += this.generateFromATNSequence(state, state.stopState, !inLexer);
                            }
                            run = transition.target;
                            break;
                        }
                        default: {
                            if (inLexer) {
                                if (transition.label) {
                                    let label = transition.label;
                                    if (transition instanceof atn_1.NotSetTransition) {
                                        label = label.complement(misc_1.IntervalSet.COMPLETE_CHAR_SET);
                                    }
                                    result += this.getRandomCharacterFromInterval(label);
                                }
                            }
                            else {
                                if (transition.label && transition.label.maxElement > -1) {
                                    let randomIndex = Math.floor(Math.random() * transition.label.size);
                                    let tokenIndex = this.getIntervalElement(transition.label, randomIndex);
                                    let state = this.lexerATN.ruleToStartState[tokenIndex - 1];
                                    result += this.generateFromATNSequence(state, state.stopState, !inLexer);
                                }
                            }
                            run = transition.target;
                            break;
                        }
                    }
                }
            }
        }
        if (addSpace) {
            return result + " ";
        }
        return result;
    }
    generateFromDecisionState(state, addSpace) {
        let decision = this.getRandomDecision(state);
        let decisionCounts = state.atn == this.lexerATN ? this.lexerDecisionCounts : this.parserDecisionCounts;
        let altCounts = decisionCounts.get(state.decision);
        ++altCounts[decision];
        let startState;
        let endState;
        switch (state.stateType) {
            case atn_1.ATNStateType.BLOCK_START: {
                startState = state;
                endState = state.endState;
                break;
            }
            case atn_1.ATNStateType.PLUS_BLOCK_START: {
                endState = state.loopBackState;
                break;
            }
            default: {
                throw new Error("Unhandled state type in sentence generator");
            }
        }
        let result = "";
        if (startState != endState) {
            result = this.generateFromATNSequence(state.transition(decision).target, endState, addSpace);
        }
        --altCounts[decision];
        return result;
    }
    getRandomDecision(state) {
        let decisionCounts = state.atn == this.lexerATN ? this.lexerDecisionCounts : this.parserDecisionCounts;
        let weights = new Array(state.numberOfTransitions).fill(1);
        let altCounts = decisionCounts.get(state.decision);
        if (!altCounts) {
            altCounts = new Array(state.numberOfTransitions).fill(0);
            decisionCounts.set(state.decision, altCounts);
        }
        else {
            for (let i = 0; i < altCounts.length; ++i) {
                weights[i] = Math.pow(this.convergenceFactor, altCounts[i]);
            }
        }
        let sum = weights.reduce((accumulated, current) => accumulated + current);
        let randomValue = Math.random() * sum;
        let randomIndex = 0;
        while (true) {
            randomValue -= weights[randomIndex];
            if (randomValue < 0) {
                return randomIndex;
            }
            ++randomIndex;
        }
    }
    loopEnd(state) {
        for (let transition of state.getTransitions()) {
            if (transition.target.stateType == atn_1.ATNStateType.LOOP_END) {
                return transition.target;
            }
        }
    }
    blockStart(state) {
        for (let transition of state.getTransitions()) {
            if (transition.target.stateType == atn_1.ATNStateType.STAR_BLOCK_START) {
                return transition.target;
            }
        }
    }
    getIntervalElement(set, index) {
        let runningIndex = 0;
        for (let interval of set.intervals) {
            let intervalSize = interval.b - interval.a + 1;
            if (index < runningIndex + intervalSize) {
                return interval.a + index - runningIndex;
            }
            runningIndex += intervalSize;
        }
        return runningIndex;
    }
    getRandomCharacterFromInterval(set) {
        let validSet = this.printableUnicode.and(set);
        return String.fromCodePoint(this.getIntervalElement(validSet, Math.floor(Math.random() * validSet.size)));
    }
}
exports.SentenceGenerator = SentenceGenerator;
;
//# sourceMappingURL=SentenceGenerator.js.map