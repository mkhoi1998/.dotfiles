"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const atn_1 = require("antlr4ts/atn");
const misc_1 = require("antlr4ts/misc");
const Decorators_1 = require("antlr4ts/Decorators");
const antlr4ts_1 = require("antlr4ts");
const DFA_1 = require("antlr4ts/dfa/DFA");
class CompatibleATNDeserializer extends atn_1.ATNDeserializer {
    constructor(deserializationOptions) {
        super(deserializationOptions);
        if (deserializationOptions == null) {
            deserializationOptions = atn_1.ATNDeserializationOptions.defaultOptions;
        }
        this.deserializationOptions2 = deserializationOptions;
    }
    static isFeatureSupported(feature, actualUuid) {
        let featureIndex = CompatibleATNDeserializer.SUPPORTED_UUIDS2.findIndex(e => e.equals(feature));
        if (featureIndex < 0) {
            return false;
        }
        return CompatibleATNDeserializer.SUPPORTED_UUIDS2.findIndex(e => e.equals(actualUuid)) >= featureIndex;
    }
    static getUnicodeDeserializer2(mode) {
        if (mode === 0) {
            return {
                readUnicode: (data, p) => {
                    return atn_1.ATNDeserializer.toInt(data[p]);
                },
                size: 1,
            };
        }
        else {
            return {
                readUnicode: (data, p) => {
                    return atn_1.ATNDeserializer.toInt32(data, p);
                },
                size: 2,
            };
        }
    }
    deserialize(data) {
        data = data.slice(0);
        for (let i = 1; i < data.length; i++) {
            data[i] = (data[i] - 2) & 0xFFFF;
        }
        let p = 0;
        let version = atn_1.ATNDeserializer.toInt(data[p++]);
        if (version !== atn_1.ATNDeserializer.SERIALIZED_VERSION) {
            let reason = `Could not deserialize ATN with version ${version} (expected ${atn_1.ATNDeserializer.SERIALIZED_VERSION}).`;
            throw new Error(reason);
        }
        let uuid = atn_1.ATNDeserializer.toUUID(data, p);
        p += 8;
        if (CompatibleATNDeserializer.SUPPORTED_UUIDS2.findIndex((e) => e.equals(uuid)) < 0) {
            let reason = `Could not deserialize ATN with UUID ${uuid} (expected ${CompatibleATNDeserializer.SERIALIZED_UUID2} or a legacy UUID).`;
            throw new Error(reason);
        }
        let generatedByOriginalANTLR4 = uuid.equals(CompatibleATNDeserializer.ADDED_UNICODE_SMP_ORIGINAL);
        let supportsLexerActions = CompatibleATNDeserializer.isFeatureSupported(CompatibleATNDeserializer.ADDED_LEXER_ACTIONS2, uuid);
        let grammarType = atn_1.ATNDeserializer.toInt(data[p++]);
        let maxTokenType = atn_1.ATNDeserializer.toInt(data[p++]);
        let atn = new atn_1.ATN(grammarType, maxTokenType);
        let loopBackStateNumbers = [];
        let endStateNumbers = [];
        let nstates = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 0; i < nstates; i++) {
            let stype = atn_1.ATNDeserializer.toInt(data[p++]);
            if (stype === atn_1.ATNStateType.INVALID_TYPE) {
                atn.addState(new atn_1.InvalidState());
                continue;
            }
            let ruleIndex = atn_1.ATNDeserializer.toInt(data[p++]);
            if (ruleIndex === 0xFFFF) {
                ruleIndex = -1;
            }
            let s = this.stateFactory(stype, ruleIndex);
            if (stype === atn_1.ATNStateType.LOOP_END) {
                let loopBackStateNumber = atn_1.ATNDeserializer.toInt(data[p++]);
                loopBackStateNumbers.push([s, loopBackStateNumber]);
            }
            else if (s instanceof atn_1.BlockStartState) {
                let endStateNumber = atn_1.ATNDeserializer.toInt(data[p++]);
                endStateNumbers.push([s, endStateNumber]);
            }
            atn.addState(s);
        }
        for (let pair of loopBackStateNumbers) {
            pair[0].loopBackState = atn.states[pair[1]];
        }
        for (let pair of endStateNumbers) {
            pair[0].endState = atn.states[pair[1]];
        }
        let numNonGreedyStates = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 0; i < numNonGreedyStates; i++) {
            let stateNumber = atn_1.ATNDeserializer.toInt(data[p++]);
            atn.states[stateNumber].nonGreedy = true;
        }
        if (!generatedByOriginalANTLR4) {
            let numSllDecisions = atn_1.ATNDeserializer.toInt(data[p++]);
            for (let i = 0; i < numSllDecisions; i++) {
                let stateNumber = atn_1.ATNDeserializer.toInt(data[p++]);
                atn.states[stateNumber].sll = true;
            }
        }
        let numPrecedenceStates = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 0; i < numPrecedenceStates; i++) {
            let stateNumber = atn_1.ATNDeserializer.toInt(data[p++]);
            atn.states[stateNumber].isPrecedenceRule = true;
        }
        let nrules = atn_1.ATNDeserializer.toInt(data[p++]);
        if (atn.grammarType === 0) {
            atn.ruleToTokenType = new Int32Array(nrules);
        }
        atn.ruleToStartState = new Array(nrules);
        for (let i = 0; i < nrules; i++) {
            let s = atn_1.ATNDeserializer.toInt(data[p++]);
            let startState = atn.states[s];
            if (!generatedByOriginalANTLR4) {
                startState.leftFactored = atn_1.ATNDeserializer.toInt(data[p++]) !== 0;
            }
            atn.ruleToStartState[i] = startState;
            if (atn.grammarType === 0) {
                let tokenType = atn_1.ATNDeserializer.toInt(data[p++]);
                if (tokenType === 0xFFFF) {
                    tokenType = antlr4ts_1.Token.EOF;
                }
                atn.ruleToTokenType[i] = tokenType;
                if (!CompatibleATNDeserializer.isFeatureSupported(CompatibleATNDeserializer.ADDED_LEXER_ACTIONS2, uuid)) {
                    let actionIndexIgnored = atn_1.ATNDeserializer.toInt(data[p++]);
                    if (actionIndexIgnored === 0xFFFF) {
                        actionIndexIgnored = -1;
                    }
                }
            }
        }
        atn.ruleToStopState = new Array(nrules);
        for (let state of atn.states) {
            if (!(state instanceof atn_1.RuleStopState)) {
                continue;
            }
            atn.ruleToStopState[state.ruleIndex] = state;
            atn.ruleToStartState[state.ruleIndex].stopState = state;
        }
        let nmodes = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 0; i < nmodes; i++) {
            let s = atn_1.ATNDeserializer.toInt(data[p++]);
            atn.modeToStartState.push(atn.states[s]);
        }
        atn.modeToDFA = new Array(nmodes);
        for (let i = 0; i < nmodes; i++) {
            atn.modeToDFA[i] = new DFA_1.DFA(atn.modeToStartState[i]);
        }
        let sets = [];
        p = this.deserializeSets2(data, p, sets, CompatibleATNDeserializer.getUnicodeDeserializer2(0));
        if (CompatibleATNDeserializer.isFeatureSupported(CompatibleATNDeserializer.ADDED_UNICODE_SMP2, uuid)
            || CompatibleATNDeserializer.isFeatureSupported(CompatibleATNDeserializer.ADDED_UNICODE_SMP_ORIGINAL, uuid)) {
            p = this.deserializeSets2(data, p, sets, CompatibleATNDeserializer.getUnicodeDeserializer2(1));
        }
        let nedges = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 0; i < nedges; i++) {
            let src = atn_1.ATNDeserializer.toInt(data[p]);
            let trg = atn_1.ATNDeserializer.toInt(data[p + 1]);
            let ttype = atn_1.ATNDeserializer.toInt(data[p + 2]);
            let arg1 = atn_1.ATNDeserializer.toInt(data[p + 3]);
            let arg2 = atn_1.ATNDeserializer.toInt(data[p + 4]);
            let arg3 = atn_1.ATNDeserializer.toInt(data[p + 5]);
            let trans = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
            let srcState = atn.states[src];
            srcState.addTransition(trans);
            p += 6;
        }
        let returnTransitionsSet = new misc_1.Array2DHashSet({
            hashCode: (o) => o.stopState ^ o.returnState ^ o.outermostPrecedenceReturn,
            equals: (a, b) => {
                return a.stopState === b.stopState
                    && a.returnState === b.returnState
                    && a.outermostPrecedenceReturn === b.outermostPrecedenceReturn;
            },
        });
        let returnTransitions = [];
        for (let state of atn.states) {
            let returningToLeftFactored = state.ruleIndex >= 0 && atn.ruleToStartState[state.ruleIndex].leftFactored;
            for (let i = 0; i < state.numberOfTransitions; i++) {
                let t = state.transition(i);
                if (!(t instanceof atn_1.RuleTransition)) {
                    continue;
                }
                let ruleTransition = t;
                let returningFromLeftFactored = atn.ruleToStartState[ruleTransition.target.ruleIndex].leftFactored;
                if (!returningFromLeftFactored && returningToLeftFactored) {
                    continue;
                }
                let outermostPrecedenceReturn = -1;
                if (atn.ruleToStartState[ruleTransition.target.ruleIndex].isPrecedenceRule) {
                    if (ruleTransition.precedence === 0) {
                        outermostPrecedenceReturn = ruleTransition.target.ruleIndex;
                    }
                }
                let current = { stopState: ruleTransition.target.ruleIndex, returnState: ruleTransition.followState.stateNumber, outermostPrecedenceReturn };
                if (returnTransitionsSet.add(current)) {
                    returnTransitions.push(current);
                }
            }
        }
        for (let returnTransition of returnTransitions) {
            let transition = new atn_1.EpsilonTransition(atn.states[returnTransition.returnState], returnTransition.outermostPrecedenceReturn);
            atn.ruleToStopState[returnTransition.stopState].addTransition(transition);
        }
        for (let state of atn.states) {
            if (state instanceof atn_1.BlockStartState) {
                if (state.endState == null) {
                    throw new Error("IllegalStateException");
                }
                if (state.endState.startState != null) {
                    throw new Error("IllegalStateException");
                }
                state.endState.startState = state;
            }
            if (state instanceof atn_1.PlusLoopbackState) {
                let loopbackState = state;
                for (let i = 0; i < loopbackState.numberOfTransitions; i++) {
                    let target = loopbackState.transition(i).target;
                    if (target instanceof atn_1.PlusBlockStartState) {
                        target.loopBackState = loopbackState;
                    }
                }
            }
            else if (state instanceof atn_1.StarLoopbackState) {
                let loopbackState = state;
                for (let i = 0; i < loopbackState.numberOfTransitions; i++) {
                    let target = loopbackState.transition(i).target;
                    if (target instanceof atn_1.StarLoopEntryState) {
                        target.loopBackState = loopbackState;
                    }
                }
            }
        }
        let ndecisions = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 1; i <= ndecisions; i++) {
            let s = atn_1.ATNDeserializer.toInt(data[p++]);
            let decState = atn.states[s];
            atn.decisionToState.push(decState);
            decState.decision = i - 1;
        }
        if (atn.grammarType === 0) {
            if (supportsLexerActions) {
                atn.lexerActions = new Array(atn_1.ATNDeserializer.toInt(data[p++]));
                for (let i = 0; i < atn.lexerActions.length; i++) {
                    let actionType = atn_1.ATNDeserializer.toInt(data[p++]);
                    let data1 = atn_1.ATNDeserializer.toInt(data[p++]);
                    if (data1 === 0xFFFF) {
                        data1 = -1;
                    }
                    let data2 = atn_1.ATNDeserializer.toInt(data[p++]);
                    if (data2 === 0xFFFF) {
                        data2 = -1;
                    }
                    let lexerAction = this.lexerActionFactory(actionType, data1, data2);
                    atn.lexerActions[i] = lexerAction;
                }
            }
            else {
                let legacyLexerActions = [];
                for (let state of atn.states) {
                    for (let i = 0; i < state.numberOfTransitions; i++) {
                        let transition = state.transition(i);
                        if (!(transition instanceof atn_1.ActionTransition)) {
                            continue;
                        }
                        let ruleIndex = transition.ruleIndex;
                        let actionIndex = transition.actionIndex;
                        let lexerAction = new atn_1.LexerCustomAction(ruleIndex, actionIndex);
                        state.setTransition(i, new atn_1.ActionTransition(transition.target, ruleIndex, legacyLexerActions.length, false));
                        legacyLexerActions.push(lexerAction);
                    }
                }
                atn.lexerActions = legacyLexerActions;
            }
        }
        this.markPrecedenceDecisions(atn);
        atn.decisionToDFA = new Array(ndecisions);
        for (let i = 0; i < ndecisions; i++) {
            atn.decisionToDFA[i] = new DFA_1.DFA(atn.decisionToState[i], i);
        }
        if (this.deserializationOptions2.isVerifyATN) {
            this.verifyATN(atn);
        }
        if (this.deserializationOptions2.isGenerateRuleBypassTransitions && atn.grammarType === 1) {
            atn.ruleToTokenType = new Int32Array(atn.ruleToStartState.length);
            for (let i = 0; i < atn.ruleToStartState.length; i++) {
                atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
            }
            for (let i = 0; i < atn.ruleToStartState.length; i++) {
                let bypassStart = new atn_1.BasicBlockStartState();
                bypassStart.ruleIndex = i;
                atn.addState(bypassStart);
                let bypassStop = new atn_1.BlockEndState();
                bypassStop.ruleIndex = i;
                atn.addState(bypassStop);
                bypassStart.endState = bypassStop;
                atn.defineDecisionState(bypassStart);
                bypassStop.startState = bypassStart;
                let endState;
                let excludeTransition;
                if (atn.ruleToStartState[i].isPrecedenceRule) {
                    endState = undefined;
                    for (let state of atn.states) {
                        if (state.ruleIndex !== i) {
                            continue;
                        }
                        if (!(state instanceof atn_1.StarLoopEntryState)) {
                            continue;
                        }
                        let maybeLoopEndState = state.transition(state.numberOfTransitions - 1).target;
                        if (!(maybeLoopEndState instanceof atn_1.LoopEndState)) {
                            continue;
                        }
                        if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transition(0).target instanceof atn_1.RuleStopState) {
                            endState = state;
                            break;
                        }
                    }
                    if (!endState) {
                        throw new Error("Couldn't identify final state of the precedence rule prefix section.");
                    }
                    excludeTransition = endState.loopBackState.transition(0);
                }
                else {
                    endState = atn.ruleToStopState[i];
                }
                for (let state of atn.states) {
                    for (let i = 0; i < state.numberOfTransitions; i++) {
                        let transition = state.transition(i);
                        if (transition === excludeTransition) {
                            continue;
                        }
                        if (transition.target === endState) {
                            transition.target = bypassStop;
                        }
                    }
                }
                while (atn.ruleToStartState[i].numberOfTransitions > 0) {
                    let transition = atn.ruleToStartState[i].removeTransition(atn.ruleToStartState[i].numberOfTransitions - 1);
                    bypassStart.addTransition(transition);
                }
                atn.ruleToStartState[i].addTransition(new atn_1.EpsilonTransition(bypassStart));
                bypassStop.addTransition(new atn_1.EpsilonTransition(endState));
                let matchState = new atn_1.BasicState();
                atn.addState(matchState);
                matchState.addTransition(new atn_1.AtomTransition(bypassStop, atn.ruleToTokenType[i]));
                bypassStart.addTransition(new atn_1.EpsilonTransition(matchState));
            }
            if (this.deserializationOptions2.isVerifyATN) {
                this.verifyATN(atn);
            }
        }
        if (this.deserializationOptions2.isOptimize) {
            while (true) {
                let optimizationCount = 0;
                optimizationCount += CompatibleATNDeserializer.inlineSetRules2(atn);
                optimizationCount += CompatibleATNDeserializer.combineChainedEpsilons2(atn);
                let preserveOrder = atn.grammarType === 0;
                optimizationCount += CompatibleATNDeserializer.optimizeSets2(atn, preserveOrder);
                if (optimizationCount === 0) {
                    break;
                }
            }
            if (this.deserializationOptions2.isVerifyATN) {
                this.verifyATN(atn);
            }
        }
        CompatibleATNDeserializer.identifyTailCalls2(atn);
        return atn;
    }
    deserializeSets2(data, p, sets, unicodeDeserializer) {
        let nsets = atn_1.ATNDeserializer.toInt(data[p++]);
        for (let i = 0; i < nsets; i++) {
            let nintervals = atn_1.ATNDeserializer.toInt(data[p]);
            p++;
            let set = new misc_1.IntervalSet();
            sets.push(set);
            let containsEof = atn_1.ATNDeserializer.toInt(data[p++]) !== 0;
            if (containsEof) {
                set.add(-1);
            }
            for (let j = 0; j < nintervals; j++) {
                let a = unicodeDeserializer.readUnicode(data, p);
                p += unicodeDeserializer.size;
                let b = unicodeDeserializer.readUnicode(data, p);
                p += unicodeDeserializer.size;
                set.add(a, b);
            }
        }
        return p;
    }
    static inlineSetRules2(atn) {
        let inlinedCalls = 0;
        let ruleToInlineTransition = new Array(atn.ruleToStartState.length);
        for (let i = 0; i < atn.ruleToStartState.length; i++) {
            let startState = atn.ruleToStartState[i];
            let middleState = startState;
            while (middleState.onlyHasEpsilonTransitions
                && middleState.numberOfOptimizedTransitions === 1
                && middleState.getOptimizedTransition(0).serializationType === 1) {
                middleState = middleState.getOptimizedTransition(0).target;
            }
            if (middleState.numberOfOptimizedTransitions !== 1) {
                continue;
            }
            let matchTransition = middleState.getOptimizedTransition(0);
            let matchTarget = matchTransition.target;
            if (matchTransition.isEpsilon
                || !matchTarget.onlyHasEpsilonTransitions
                || matchTarget.numberOfOptimizedTransitions !== 1
                || !(matchTarget.getOptimizedTransition(0).target instanceof atn_1.RuleStopState)) {
                continue;
            }
            switch (matchTransition.serializationType) {
                case 5:
                case 2:
                case 7:
                    ruleToInlineTransition[i] = matchTransition;
                    break;
                case 8:
                case 9:
                    continue;
                default:
                    continue;
            }
        }
        for (let state of atn.states) {
            if (state.ruleIndex < 0) {
                continue;
            }
            let optimizedTransitions;
            for (let i = 0; i < state.numberOfOptimizedTransitions; i++) {
                let transition = state.getOptimizedTransition(i);
                if (!(transition instanceof atn_1.RuleTransition)) {
                    if (optimizedTransitions != null) {
                        optimizedTransitions.push(transition);
                    }
                    continue;
                }
                let ruleTransition = transition;
                let effective = ruleToInlineTransition[ruleTransition.target.ruleIndex];
                if (effective == null) {
                    if (optimizedTransitions != null) {
                        optimizedTransitions.push(transition);
                    }
                    continue;
                }
                if (optimizedTransitions == null) {
                    optimizedTransitions = [];
                    for (let j = 0; j < i; j++) {
                        optimizedTransitions.push(state.getOptimizedTransition(i));
                    }
                }
                inlinedCalls++;
                let target = ruleTransition.followState;
                let intermediateState = new atn_1.BasicState();
                intermediateState.setRuleIndex(target.ruleIndex);
                atn.addState(intermediateState);
                optimizedTransitions.push(new atn_1.EpsilonTransition(intermediateState));
                switch (effective.serializationType) {
                    case 5:
                        intermediateState.addTransition(new atn_1.AtomTransition(target, effective._label));
                        break;
                    case 2:
                        intermediateState.addTransition(new atn_1.RangeTransition(target, effective.from, effective.to));
                        break;
                    case 7:
                        intermediateState.addTransition(new atn_1.SetTransition(target, effective.label));
                        break;
                    default:
                        throw new Error("UnsupportedOperationException");
                }
            }
            if (optimizedTransitions != null) {
                if (state.isOptimized) {
                    while (state.numberOfOptimizedTransitions > 0) {
                        state.removeOptimizedTransition(state.numberOfOptimizedTransitions - 1);
                    }
                }
                for (let transition of optimizedTransitions) {
                    state.addOptimizedTransition(transition);
                }
            }
        }
        if (atn_1.ParserATNSimulator.debug) {
            console.log("ATN runtime optimizer removed " + inlinedCalls + " rule invocations by inlining sets.");
        }
        return inlinedCalls;
    }
    static combineChainedEpsilons2(atn) {
        let removedEdges = 0;
        for (let state of atn.states) {
            if (!state.onlyHasEpsilonTransitions || state instanceof atn_1.RuleStopState) {
                continue;
            }
            let optimizedTransitions;
            nextTransition: for (let i = 0; i < state.numberOfOptimizedTransitions; i++) {
                let transition = state.getOptimizedTransition(i);
                let intermediate = transition.target;
                if (transition.serializationType !== 1
                    || transition.outermostPrecedenceReturn !== -1
                    || intermediate.stateType !== atn_1.ATNStateType.BASIC
                    || !intermediate.onlyHasEpsilonTransitions) {
                    if (optimizedTransitions != null) {
                        optimizedTransitions.push(transition);
                    }
                    continue nextTransition;
                }
                for (let j = 0; j < intermediate.numberOfOptimizedTransitions; j++) {
                    if (intermediate.getOptimizedTransition(j).serializationType !== 1
                        || intermediate.getOptimizedTransition(j).outermostPrecedenceReturn !== -1) {
                        if (optimizedTransitions != null) {
                            optimizedTransitions.push(transition);
                        }
                        continue nextTransition;
                    }
                }
                removedEdges++;
                if (optimizedTransitions == null) {
                    optimizedTransitions = [];
                    for (let j = 0; j < i; j++) {
                        optimizedTransitions.push(state.getOptimizedTransition(j));
                    }
                }
                for (let j = 0; j < intermediate.numberOfOptimizedTransitions; j++) {
                    let target = intermediate.getOptimizedTransition(j).target;
                    optimizedTransitions.push(new atn_1.EpsilonTransition(target));
                }
            }
            if (optimizedTransitions != null) {
                if (state.isOptimized) {
                    while (state.numberOfOptimizedTransitions > 0) {
                        state.removeOptimizedTransition(state.numberOfOptimizedTransitions - 1);
                    }
                }
                for (let transition of optimizedTransitions) {
                    state.addOptimizedTransition(transition);
                }
            }
        }
        if (atn_1.ParserATNSimulator.debug) {
            console.log("ATN runtime optimizer removed " + removedEdges + " transitions by combining chained epsilon transitions.");
        }
        return removedEdges;
    }
    static optimizeSets2(atn, preserveOrder) {
        if (preserveOrder) {
            return 0;
        }
        let removedPaths = 0;
        let decisions = atn.decisionToState;
        for (let decision of decisions) {
            let setTransitions = new misc_1.IntervalSet();
            for (let i = 0; i < decision.numberOfOptimizedTransitions; i++) {
                let epsTransition = decision.getOptimizedTransition(i);
                if (!(epsTransition instanceof atn_1.EpsilonTransition)) {
                    continue;
                }
                if (epsTransition.target.numberOfOptimizedTransitions !== 1) {
                    continue;
                }
                let transition = epsTransition.target.getOptimizedTransition(0);
                if (!(transition.target instanceof atn_1.BlockEndState)) {
                    continue;
                }
                if (transition instanceof atn_1.NotSetTransition) {
                    continue;
                }
                if (transition instanceof atn_1.AtomTransition
                    || transition instanceof atn_1.RangeTransition
                    || transition instanceof atn_1.SetTransition) {
                    setTransitions.add(i);
                }
            }
            if (setTransitions.size <= 1) {
                continue;
            }
            let optimizedTransitions = [];
            for (let i = 0; i < decision.numberOfOptimizedTransitions; i++) {
                if (!setTransitions.contains(i)) {
                    optimizedTransitions.push(decision.getOptimizedTransition(i));
                }
            }
            let blockEndState = decision.getOptimizedTransition(setTransitions.minElement).target.getOptimizedTransition(0).target;
            let matchSet = new misc_1.IntervalSet();
            for (let interval of setTransitions.intervals) {
                for (let j = interval.a; j <= interval.b; j++) {
                    let matchTransition = decision.getOptimizedTransition(j).target.getOptimizedTransition(0);
                    if (matchTransition instanceof atn_1.NotSetTransition) {
                        throw new Error("Not yet implemented.");
                    }
                    else {
                        matchSet.addAll(matchTransition.label);
                    }
                }
            }
            let newTransition;
            if (matchSet.intervals.length === 1) {
                if (matchSet.size === 1) {
                    newTransition = new atn_1.AtomTransition(blockEndState, matchSet.minElement);
                }
                else {
                    let matchInterval = matchSet.intervals[0];
                    newTransition = new atn_1.RangeTransition(blockEndState, matchInterval.a, matchInterval.b);
                }
            }
            else {
                newTransition = new atn_1.SetTransition(blockEndState, matchSet);
            }
            let setOptimizedState = new atn_1.BasicState();
            setOptimizedState.setRuleIndex(decision.ruleIndex);
            atn.addState(setOptimizedState);
            setOptimizedState.addTransition(newTransition);
            optimizedTransitions.push(new atn_1.EpsilonTransition(setOptimizedState));
            removedPaths += decision.numberOfOptimizedTransitions - optimizedTransitions.length;
            if (decision.isOptimized) {
                while (decision.numberOfOptimizedTransitions > 0) {
                    decision.removeOptimizedTransition(decision.numberOfOptimizedTransitions - 1);
                }
            }
            for (let transition of optimizedTransitions) {
                decision.addOptimizedTransition(transition);
            }
        }
        if (atn_1.ParserATNSimulator.debug) {
            console.log("ATN runtime optimizer removed " + removedPaths + " paths by collapsing sets.");
        }
        return removedPaths;
    }
    static identifyTailCalls2(atn) {
        for (let state of atn.states) {
            for (let i = 0; i < state.numberOfTransitions; i++) {
                let transition = state.transition(i);
                if (!(transition instanceof atn_1.RuleTransition)) {
                    continue;
                }
                transition.tailCall = this.testTailCall2(atn, transition, false);
                transition.optimizedTailCall = this.testTailCall2(atn, transition, true);
            }
            if (!state.isOptimized) {
                continue;
            }
            for (let i = 0; i < state.numberOfOptimizedTransitions; i++) {
                let transition = state.getOptimizedTransition(i);
                if (!(transition instanceof atn_1.RuleTransition)) {
                    continue;
                }
                transition.tailCall = this.testTailCall2(atn, transition, false);
                transition.optimizedTailCall = this.testTailCall2(atn, transition, true);
            }
        }
    }
    static testTailCall2(atn, transition, optimizedPath) {
        if (!optimizedPath && transition.tailCall) {
            return true;
        }
        if (optimizedPath && transition.optimizedTailCall) {
            return true;
        }
        let reachable = new misc_1.BitSet(atn.states.length);
        let worklist = [];
        worklist.push(transition.followState);
        while (true) {
            let state = worklist.pop();
            if (!state) {
                break;
            }
            if (reachable.get(state.stateNumber)) {
                continue;
            }
            if (state instanceof atn_1.RuleStopState) {
                continue;
            }
            if (!state.onlyHasEpsilonTransitions) {
                return false;
            }
            let transitionCount = optimizedPath ? state.numberOfOptimizedTransitions : state.numberOfTransitions;
            for (let i = 0; i < transitionCount; i++) {
                let t = optimizedPath ? state.getOptimizedTransition(i) : state.transition(i);
                if (t.serializationType !== 1) {
                    return false;
                }
                worklist.push(t.target);
            }
        }
        return true;
    }
}
CompatibleATNDeserializer.BASE_SERIALIZED_UUID2 = misc_1.UUID.fromString("E4178468-DF95-44D0-AD87-F22A5D5FB6D3");
CompatibleATNDeserializer.ADDED_LEXER_ACTIONS2 = misc_1.UUID.fromString("AB35191A-1603-487E-B75A-479B831EAF6D");
CompatibleATNDeserializer.ADDED_UNICODE_SMP2 = misc_1.UUID.fromString("C23FEA89-0605-4f51-AFB8-058BCAB8C91B");
CompatibleATNDeserializer.ADDED_UNICODE_SMP_ORIGINAL = misc_1.UUID.fromString("59627784-3BE5-417A-B9EB-8131A7286089");
CompatibleATNDeserializer.SUPPORTED_UUIDS2 = [
    CompatibleATNDeserializer.BASE_SERIALIZED_UUID2,
    CompatibleATNDeserializer.ADDED_LEXER_ACTIONS2,
    CompatibleATNDeserializer.ADDED_UNICODE_SMP_ORIGINAL,
    CompatibleATNDeserializer.ADDED_UNICODE_SMP2
];
CompatibleATNDeserializer.SERIALIZED_UUID2 = CompatibleATNDeserializer.ADDED_UNICODE_SMP2;
__decorate([
    Decorators_1.NotNull
], CompatibleATNDeserializer.prototype, "deserializationOptions2", void 0);
__decorate([
    __param(0, Decorators_1.NotNull)
], CompatibleATNDeserializer.prototype, "deserialize", null);
exports.CompatibleATNDeserializer = CompatibleATNDeserializer;
//# sourceMappingURL=CompatibleATNDeserializer.js.map