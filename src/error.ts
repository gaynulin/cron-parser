/** Parsed Error. */
export class ParserError extends Error {
    private readonly msg: string;
    constructor(msg: string) {
        super(msg);
        this.msg = msg;
    }

    /** Returns the message error. */
    getMsg = () => this.msg;
}