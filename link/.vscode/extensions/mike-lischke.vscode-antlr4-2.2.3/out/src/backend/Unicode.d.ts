import { IntervalSet, Interval } from "antlr4ts/misc";
export declare const FULL_UNICODE_SET: IntervalSet;
export interface UnicodeOptions {
    excludeCJK?: boolean;
    excludeRTL?: boolean;
    limitToBMP?: boolean;
}
export declare function printableUnicodePoints(options: UnicodeOptions): IntervalSet;
export declare function randomCodeBlock(blockOverrides?: Map<string, number>): Interval;
