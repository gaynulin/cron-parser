import {spy, createStubInstance} from "sinon";
import {expect} from "chai";

import {CronInstruction} from "../src/cron";
import {IApp, TYPE_LIST} from "../src/types";
import {LineParser} from "../src/parser";
import {ParserError} from "../src/error";


describe('CronInstruction', function () {
    const stubParser = createStubInstance(LineParser);
    stubParser.parse.onCall(0).returns({result: "minute              1"});
    stubParser.parse.onCall(1).returns({result: "hour                1"});
    stubParser.parse.onCall(2).returns({result: "day of month        1"});
    stubParser.parse.onCall(3).returns({result: "month               1"});
    stubParser.parse.onCall(4).returns({result: "day of week         1"});
    stubParser.parse.onCall(5).returns({result: "command             /command"});
    const warnSpy = spy();
    const app: IApp = {logger: {warn: warnSpy, log: spy(), error: spy()}};

    it("renders the table successfully", () => {
        const instruction = new CronInstruction(app, ["1 1 1 1 1 /command"], stubParser);

        expect(warnSpy.calledOnce).to.be.false;
        expect(instruction.render()).to.equal(
            "minute              1\n" +
            "hour                1\n" +
            "day of month        1\n" +
            "month               1\n" +
            "day of week         1\n" +
            "command             /command");
    });

    it("catches the error", () => {
        const errMsg = `Not valid number of value=r for type=${TYPE_LIST.MONTH}`;
        stubParser.parse.returns({error: new ParserError(errMsg)});

        const instruction = new CronInstruction(app, ["1 1 1 */r 1 /command"], stubParser);

        expect(warnSpy.calledOnce).to.be.true;
        expect(warnSpy.lastCall.args[0]).to.equal(errMsg);
        expect(instruction.render()).to.equal("The cron instruction###1 1 1 */r 1 /command### is not valid");
    });
});
