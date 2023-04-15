import {IApp, LETTERS, TYPE_LIST} from "./types";
import {ICronPartParser, LineParser} from "./parser";
import {ParserError} from "./error";
import {ILogger} from "./logger";


/** Handles cron instruction. */
export class CronInstruction {
    /** @todo Probably, could be optimised. */
    private static CRON_PART_REGEX = "((((\\d+,)+\\d+|(\\d+(\\/|-)\\d+)|\\d+|\\*)))";

    private readonly instruction: string;
    private readonly lineParser: ICronPartParser;
    private readonly logger: ILogger;

    private result?: string;
    private parts: string[] = [];

    constructor(app: IApp, instruction: string[], lineParser: ICronPartParser = new LineParser()) {
        this.instruction = (instruction[0] || "").toLowerCase();
        this.lineParser = lineParser;
        this.logger = app.logger;

        try {
            this.parseParts();
            this.parseResult();
        } catch (e) {
            if (e instanceof ParserError) {
                this.logger.warn(e.getMsg());
            } else {
                throw e;
            }
        }
    }

    /** Renders the result of the cron parsing. */
    render = () => this.result ?? `The cron instruction###${this.instruction}### is not valid`;

    private parseParts() {
        const [m, h, d, mon, w, ...command] = this.instruction.split(" ") as string[];
        const partRegex = new RegExp(CronInstruction.CRON_PART_REGEX);
        if ([m, h, d, mon, w].some(v => !partRegex.test(v))) {
            throw new ParserError("Part of the instruction is not valid");
        }

        if (!command[0] || /\w/.test(command[0]) === false) {
            throw new ParserError("Command is not valid");
        }

        this.parts = [m, h, d, mon, w, command.join(" ")];
    }

    private parseResult() {
        const partTypeMap = [
            TYPE_LIST.MINUTE,
            TYPE_LIST.HOUR,
            TYPE_LIST.DAY_OF_MONTH,
            TYPE_LIST.MONTH,
            TYPE_LIST.DAY_OF_WEEK,
            TYPE_LIST.COMMAND
        ];
        const result = [];
        for (let i = 0; i < this.parts.length; i++) {
            const parsed = this.lineParser.parse(partTypeMap[i], this.parts[i]);
            if (parsed.error) {
                throw new ParserError(parsed.error.getMsg());
            }
            result.push(parsed.result);
        }

        this.result = result.join(LETTERS.NEXT_LINE);
    }
}
