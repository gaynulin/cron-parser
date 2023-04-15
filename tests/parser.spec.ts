import {expect} from "chai";

import {LineParser} from "../src/parser";
import {TYPE_LIST} from "../src/types";


describe('Parser', function () {
    const lineParser = new LineParser();
    const tests = [
        {v: "*/10", type: TYPE_LIST.MINUTE, expected: `${TYPE_LIST.MINUTE}` + " ".repeat(14) + "0 10 20 30 40 50"},
        {
            v: "2,4-7,3,17,*/3",
            type: TYPE_LIST.HOUR,
            expected: `${TYPE_LIST.HOUR}` + " ".repeat(16) + "0 2 3 4 5 6 7 9 12 15 17 18 21"
        },
        {v: "1,12", type: TYPE_LIST.DAY_OF_MONTH, expected: `${TYPE_LIST.DAY_OF_MONTH}` + " ".repeat(8) + "1 12"},
        {v: "*", type: TYPE_LIST.MONTH, expected: `${TYPE_LIST.MONTH}` + " ".repeat(15) + "1 2 3 4 5 6 7 8 9 10 11 12"},
        {v: "1-5", type: TYPE_LIST.DAY_OF_WEEK, expected: `${TYPE_LIST.DAY_OF_WEEK}` + " ".repeat(9) + "1 2 3 4 5"},
        {v: "/command", type: TYPE_LIST.COMMAND, expected: `${TYPE_LIST.COMMAND}` + " ".repeat(13) + "/command"},
    ];

    tests.forEach(({v, type, expected}) => {
        it(`renders line for type=${type}`, function () {
            const res = lineParser.parse(type, v);
            expect(res.error).is.undefined;
            expect(res.result).to.equal(expected);
        });
    });

    describe('errors', () => {
        it("sets invalid type error", function () {
            const res = lineParser.parse("wrong-type" as TYPE_LIST, "*");
            expect(res.result).is.undefined;
            expect(res.error!.getMsg()).to.equal("Type[wrong-type] is not valid");
        });

        it("sets start-end values error", function () {
            const res = lineParser.parse(TYPE_LIST.HOUR, "4-2");
            expect(res.result).is.undefined;
            expect(res.error!.getMsg()).to.equal(`Start[4] or End[2] value is not valid for type[${TYPE_LIST.HOUR}]`);
        });

        it("sets invalid number error", function () {
            const res = lineParser.parse(TYPE_LIST.HOUR, "1,3,h,4-10");
            expect(res.result).is.undefined;
            expect(res.error!.getMsg()).to.equal(`Not valid number of value=h for type=${TYPE_LIST.HOUR}`);
        });

        it("sets invalid divider error", function () {
            const res = lineParser.parse(TYPE_LIST.HOUR, "*/0");
            expect(res.result).is.undefined;
            expect(res.error!.getMsg()).to.equal(`The divider[0] is not valid for type[${TYPE_LIST.HOUR}]`);
        });
    });
});
