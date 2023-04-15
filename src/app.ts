import {IApp} from "./types";
import {CronInstruction} from "./cron";
import {Logger} from "./logger";

const app: IApp = {logger: Logger};
const instruction = new CronInstruction(app, process.argv.slice(2));

console.log(instruction.render());
