import { ATNDeserializer, ATNDeserializationOptions, ATN } from "antlr4ts/atn";
import { UUID } from "antlr4ts/misc";
export declare class CompatibleATNDeserializer extends ATNDeserializer {
    private static readonly BASE_SERIALIZED_UUID2;
    private static readonly ADDED_LEXER_ACTIONS2;
    private static readonly ADDED_UNICODE_SMP2;
    private static readonly ADDED_UNICODE_SMP_ORIGINAL;
    private static readonly SUPPORTED_UUIDS2;
    private static readonly SERIALIZED_UUID2;
    private readonly deserializationOptions2;
    constructor(deserializationOptions?: ATNDeserializationOptions);
    static isFeatureSupported(feature: UUID, actualUuid: UUID): boolean;
    private static getUnicodeDeserializer2;
    deserialize(data: Uint16Array): ATN;
    private deserializeSets2;
    private static inlineSetRules2;
    private static combineChainedEpsilons2;
    private static optimizeSets2;
    private static identifyTailCalls2;
    private static testTailCall2;
}
