import {LETTERS, TYPE_LIST} from "./types";
import {ParserError} from "./error";

interface IParserResult {
    /** If is not empty the parsing of the line failed. */
    error?: ParserError;
    /** Keeps the result of parsed line. */
    result?: string
}
export interface ICronPartParser {
    parse(type: TYPE_LIST, val: string): IParserResult
}
/** Handles the line to the human-readable string. */
export class LineParser implements ICronPartParser{
    private static MAX_VALUE_MAP = new Map([
        [TYPE_LIST.MINUTE, 60],
        [TYPE_LIST.HOUR, 24],
        [TYPE_LIST.DAY_OF_MONTH, 31],
        [TYPE_LIST.MONTH, 12],
        [TYPE_LIST.DAY_OF_WEEK, 7],
    ]);
    private static START_VALUE_MAP = new Map([
        [TYPE_LIST.MINUTE, 0],
        [TYPE_LIST.HOUR, 0],
        [TYPE_LIST.DAY_OF_MONTH, 1],
        [TYPE_LIST.MONTH, 1],
        [TYPE_LIST.DAY_OF_WEEK, 1],
    ]);

    /** Parses the cron instruction part by its type. */
    parse(type: TYPE_LIST, val: string): IParserResult {
        let res:IParserResult;
        try {
            res = {result: this.handleType(type, val)};
        } catch (e) {
            if (e instanceof ParserError) {
                res = {error: e};
            } else {
                throw e;
            }
        }

        return res;
    }

    private handleType(type: TYPE_LIST, val: string): string {
        if (Array.from(LineParser.MAX_VALUE_MAP.keys()).includes(type)) {
            return  this.renderTitle(type) + this.parseDate(val, type);
        } else if (type === TYPE_LIST.COMMAND) {
            return  this.renderTitle(type) + val;
        } else {
            throw new ParserError(`Type[${type}] is not valid`);
        }
    }

    /** Parses the value and transforms the result to the readable line. */
    private parseDate(val: string, type: TYPE_LIST): string {
        if (val === LETTERS.ASTRIX) {
            return new Array(LineParser.MAX_VALUE_MAP.get(type))
                .fill(0)
                .map((v, i) => LineParser.START_VALUE_MAP.get(type)! + i)
                .join(LETTERS.SPACE);
        }

        return val
            .split(LETTERS.COMMA)
            .flatMap(v => {
                if (v.indexOf(LETTERS.DASH) !== -1) {
                    const [start, end] = v.split(LETTERS.DASH);
                    LineParser.checkValidNumber(start, type);
                    LineParser.checkValidNumber(end, type);

                    const startNumber = Number(start);
                    const endNumber = Number(end);
                    if (endNumber < startNumber ||
                        endNumber > LineParser.MAX_VALUE_MAP.get(type)! ||
                        startNumber < LineParser.START_VALUE_MAP.get(type)!) {
                        throw new ParserError(
                            `Start[${startNumber}] or End[${endNumber}] value is not valid for type[${type}]`
                        );
                    }

                    return new Array(endNumber - startNumber + 1)
                        .fill(0)
                        .map((unused, i) => startNumber + i);

                } else if (v.indexOf(LETTERS.ASTRIX + LETTERS.SLASH) === 0) {
                    const [, divider] = v.split(LETTERS.SLASH);
                    LineParser.checkValidNumber(divider, type);

                    const dividerNumber = Number(divider);
                    if (!dividerNumber) {
                        throw new ParserError(`The divider[${divider}] is not valid for type[${type}]`);
                    }

                    const options = [];
                    for (let i = LineParser.START_VALUE_MAP.get(type)!;
                         i < LineParser.MAX_VALUE_MAP.get(type)!;
                         i = i + dividerNumber) {
                        options.push(i);
                    }

                    return options;
                }

                LineParser.checkValidNumber(v, type);
                return Number(v);
            })
            // Fills only unique values
            .reduce((acc, item) => acc.includes(item) ||
            item >= LineParser.MAX_VALUE_MAP.get(type)! ||
            item < LineParser.START_VALUE_MAP.get(type)!
                ? acc
                : acc.concat(item), [] as number[])
            // Sorts the list
            .sort((a, b) => a - b)
            // Prepares the line
            .join(LETTERS.SPACE);
    }

    /** Prepares title column cell with the length of 20. */
    private renderTitle = (type: TYPE_LIST) => type + " ".repeat(20 - type.length);

    private static checkValidNumber(v: string = "", type: TYPE_LIST) {
        if (v.replace(/\D/g, "") !== v ||
            Number(v) < LineParser.START_VALUE_MAP.get(type)! ||
            Number(v) > LineParser.MAX_VALUE_MAP.get(type)!) {
            throw new ParserError(`Not valid number of value=${v} for type=${type}`);
        }
    }
}