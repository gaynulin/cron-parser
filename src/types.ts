/** Describes the main application interface. */
import {ILogger} from "./logger";

export interface IApp {
    logger: ILogger;
}

/** The list of the cron parts. */
export enum TYPE_LIST {
    MINUTE = "minute",
    HOUR = "hour",
    DAY_OF_MONTH = "day of month",
    MONTH = "month",
    DAY_OF_WEEK = "day of week",
    COMMAND = "command",
}

/** List of the letters in the cron string. */
export enum LETTERS {
    ASTRIX = "*",
    COMMA = ",",
    DASH = "-",
    NEXT_LINE = "\n",
    SLASH = "/",
    SPACE = " ",
}
