/** Describes the logger interface. */
export interface ILogger {
    log: (s: string) => void;
    warn: (s: string) => void;
    error: (s: string) => void;
}

/** The logger implementation. */
export const Logger = console;
