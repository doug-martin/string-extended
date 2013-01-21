"use strict";
var it = require('it'),
    assert = require('assert'),
    stringExtended = require("../"),
    dateExtended = require("date-extended");


it.describe("string-extended",function (it) {


    var getTimeZoneOffset = function (date) {
        var offset = date.getTimezoneOffset();
        var tz = [
            (offset > 0 ? "-" : "+"),
            stringExtended.pad(Math.floor(Math.abs(offset) / 60), 2, "0"),
            stringExtended.pad(Math.abs(offset) % 60, 2, "0")
        ];
        return [(offset >= 0 ? -1 : 1) * Math.floor(Math.abs(offset)) / 60, tz.join(""), dateExtended.getTimezoneName(date)];
    };


    it.should("pad correctly", function () {
        assert.equal(stringExtended.pad("STR", 5, " "), "  STR");
        assert.equal(stringExtended.pad("STR", 5, " ", true), "STR  ");
        assert.equal(stringExtended.pad("STR", 5, "$"), "$$STR");
        assert.equal(stringExtended.pad("STR", 5, "$", true), "STR$$");

        assert.equal(stringExtended("STR").pad(5, " ").value(), "  STR");
        assert.equal(stringExtended("STR").pad(5, " ", true).value(), "STR  ");
        assert.equal(stringExtended("STR").pad(5, "$").value(), "$$STR");
        assert.equal(stringExtended("STR").pad(5, "$", true).value(), "STR$$");
    });


    it.should("format strings properly", function () {
        assert.equal(stringExtended.format("{apple}, {orange}, {notthere} and {number}", {apple: "apple", orange: "orange", number: 10}), "apple, orange, {notthere} and 10");
        assert.equal(stringExtended.format("{[-s10]apple}, {[%#10]orange}, {[10]banana} and {[-10]watermelons}", {apple: "apple", orange: "orange", banana: "bananas", watermelons: "watermelons"}), "applesssss, ####orange,    bananas and watermelon");
        assert.equal(stringExtended.format("{[- 10]number}, {[yyyy]date}, and {[4]object}", {number: 1, date: new Date(1970, 1, 1), object: {a: "b"}}), '1         , 1970, and {\n    "a": "b"\n}');
        assert.equal(stringExtended.format("%s and %s", ["apple", "orange"]), "apple and orange");
        assert.equal(stringExtended.format("%s and %s and %s", ["apple", "orange"]), "apple and orange and %s");
        assert.equal(stringExtended.format("%s and %s", "apple", "orange"), "apple and orange");
        assert.equal(stringExtended.format("%-s10s, %#10s, %10s and %-10s", "apple", "orange", "bananas", "watermelons"), "applesssss, ####orange,    bananas and watermelon");
        assert.equal(stringExtended.format("%d and %d", 1, 2), "1 and 2");
        assert.throws(function () {
            stringExtended.format("%-10d", "a");
        });
        assert.equal(stringExtended.format("%+d, %+d, %10d, %-10d, %-+#10d, %10d", 1, -2, 1, 2, 3, 100000000000), "+1, -2, 0000000001, 2000000000, +3########, 1000000000");
        assert.equal(stringExtended.format("%j", [
            {a: "b"}
        ]), '{"a":"b"}');

        var test = {};
        assert.throws(function () {
            stringExtended.format("%j", [comb.merge(test, {a: test})]);
        });
        assert.throws(function () {
            stringExtended.format("%4j", [comb.merge(test, {a: test})]);
        });
        var tzInfo = getTimeZoneOffset(new Date(-1));
        assert.equal(stringExtended.format("%D", [new Date(-1)]), 'Wed Dec 31 1969 ' + (23 + tzInfo[0]) + ':59:59 GMT' + tzInfo[1] + " (" + tzInfo[2] + ")");
        var date = new Date(2006, 7, 11, 0, 55, 12, 345), tzInfo = getTimeZoneOffset(date);
        assert.equal(stringExtended.format("%[yyyy]D %[EEEE, MMMM dd, yyyy]D %[M/dd/yy]D %[H:m:s.SS]D", [date, date, date, date]), '2006 Friday, August 11, 2006 8/11/06 0:55:12.35');
        assert.equal(stringExtended.format("%[yyyy]Z %[EEEE, MMMM dd, yyyy]Z %[M/dd/yy]Z %[H:m:s.SS]Z", [date, date, date, date]), '2006 Friday, August 11, 2006 8/11/06 ' + date.getUTCHours() + ':55:12.35');
        assert.equal(stringExtended.format("%Z", [new Date(-1)]), 'Wed, 31 Dec 1969 23:59:59 GMT');
        assert.equal(stringExtended.format("%1j,\n%4j", [
            {a: "b"},
            {a: "b"}
        ]), '{\n "a": "b"\n},\n{\n    "a": "b"\n}');


        assert.equal(stringExtended("{apple}, {orange}, {notthere} and {number}").format({apple: "apple", orange: "orange", number: 10}).value(), "apple, orange, {notthere} and 10");
        assert.equal(stringExtended("{[-s10]apple}, {[%#10]orange}, {[10]banana} and {[-10]watermelons}").format({apple: "apple", orange: "orange", banana: "bananas", watermelons: "watermelons"}).value(), "applesssss, ####orange,    bananas and watermelon");
        assert.equal(stringExtended("{[- 10]number}, {[yyyy]date}, and {[4]object}").format({number: 1, date: new Date(1970, 1, 1), object: {a: "b"}}).value(), '1         , 1970, and {\n    "a": "b"\n}');
        assert.equal(stringExtended("%s and %s").format(["apple", "orange"]).value(), "apple and orange");
        assert.equal(stringExtended("%s and %s and %s").format(["apple", "orange"]).value(), "apple and orange and %s");
        assert.equal(stringExtended("%s and %s").format("apple", "orange").value(), "apple and orange");
        assert.equal(stringExtended("%-s10s, %#10s, %10s and %-10s").format("apple", "orange", "bananas", "watermelons").value(), "applesssss, ####orange,    bananas and watermelon");
        assert.equal(stringExtended("%d and %d").format(1, 2).value(), "1 and 2");
        assert.throws(function () {
            stringExtended("%-10d").format("a");
        });
        assert.equal(stringExtended("%+d, %+d, %10d, %-10d, %-+#10d, %10d").format(1, -2, 1, 2, 3, 100000000000).value(), "+1, -2, 0000000001, 2000000000, +3########, 1000000000");
        assert.equal(stringExtended("%j").format([
            {a: "b"}
        ]).value(), '{"a":"b"}');

        var test = {};
        test.test = test;
        assert.throws(function () {
            stringExtended("%j").format([test]);
        });
        assert.throws(function () {
            stringExtended("%4j").format([test]);
        });
        var tzInfo = getTimeZoneOffset(new Date(-1));
        assert.equal(stringExtended("%D").format([new Date(-1)]).value(), 'Wed Dec 31 1969 ' + (23 + tzInfo[0]) + ':59:59 GMT' + tzInfo[1] + " (" + tzInfo[2] + ")");
        var date = new Date(2006, 7, 11, 0, 55, 12, 345);
        assert.equal(stringExtended("%[yyyy]D %[EEEE, MMMM dd, yyyy]D %[M/dd/yy]D %[H:m:s.SS]D").format([date, date, date, date]).value(), '2006 Friday, August 11, 2006 8/11/06 0:55:12.35');
        assert.equal(stringExtended("%[yyyy]Z %[EEEE, MMMM dd, yyyy]Z %[M/dd/yy]Z %[H:m:s.SS]Z").format([date, date, date, date]).value(), '2006 Friday, August 11, 2006 8/11/06 ' + date.getUTCHours() + ':55:12.35');
        assert.equal(stringExtended("%Z").format([new Date(-1)]).value(), 'Wed, 31 Dec 1969 23:59:59 GMT');
        assert.equal(stringExtended("%1j,\n%4j").format([
            {a: "b"},
            {a: "b"}
        ]).value(), '{\n "a": "b"\n},\n{\n    "a": "b"\n}');

    });

    it.should("convert strings to arrays", function () {
        assert.deepEqual(stringExtended.toArray("a|b|c|d", "|"), ["a", "b", "c", "d"]);
        assert.deepEqual(stringExtended.toArray("a", "|"), ["a"]);
        assert.deepEqual(stringExtended.toArray("", "|"), []);

        assert.deepEqual(stringExtended("a|b|c|d").toArray("|").value(), ["a", "b", "c", "d"]);
        assert.deepEqual(stringExtended("a").toArray("|").value(), ["a"]);
        assert.deepEqual(stringExtended("").toArray("|").value(), []);
    });

    it.should("style strings properly", function () {
        var styles = {
            bold: 1,
            bright: 1,
            italic: 3,
            underline: 4,
            blink: 5,
            inverse: 7,
            crossedOut: 9,

            red: 31,
            green: 32,
            yellow: 33,
            blue: 34,
            magenta: 35,
            cyan: 36,
            white: 37,

            redBackground: 41,
            greenBackground: 42,
            yellowBackground: 43,
            blueBackground: 44,
            magentaBackground: 45,
            cyanBackground: 46,
            whiteBackground: 47,

            encircled: 52,
            overlined: 53,
            grey: 90,
            black: 90  };
        for (var i in styles) {
            assert.equal(stringExtended.style(i, i), '\x1B[' + styles[i] + 'm' + i + '\x1B[0m');
            assert.equal(stringExtended(i).style(i).value(), '\x1B[' + styles[i] + 'm' + i + '\x1B[0m');
        }
        assert.equal(stringExtended.style("string", ["bold", "red", "redBackground"]), '\x1B[41m\x1B[31m\x1B[1mstring\x1B[0m\x1B[0m\x1B[0m');
        assert.equal(stringExtended("string").style(["bold", "red", "redBackground"]).value(), '\x1B[41m\x1B[31m\x1B[1mstring\x1B[0m\x1B[0m\x1B[0m');
        assert.deepEqual(stringExtended.style(["string1", "string2", "string3"], ["bold", "red", "redBackground"]),
            [
                '\x1B[41m\x1B[31m\x1B[1mstring1\x1B[0m\x1B[0m\x1B[0m',
                '\x1B[41m\x1B[31m\x1B[1mstring2\x1B[0m\x1B[0m\x1B[0m',
                '\x1B[41m\x1B[31m\x1B[1mstring3\x1B[0m\x1B[0m\x1B[0m']
        );

        assert.deepEqual(stringExtended(["string1", "string2", "string3"]).style(["bold", "red", "redBackground"]).value(),
            [
                '\x1B[41m\x1B[31m\x1B[1mstring1\x1B[0m\x1B[0m\x1B[0m',
                '\x1B[41m\x1B[31m\x1B[1mstring2\x1B[0m\x1B[0m\x1B[0m',
                '\x1B[41m\x1B[31m\x1B[1mstring3\x1B[0m\x1B[0m\x1B[0m']
        );
    });

    it.should("multiply strings properly", function () {
        assert.equal(stringExtended.multiply("a"), "");
        assert.equal(stringExtended.multiply("a", 1), "a");
        assert.equal(stringExtended.multiply("a", 2), "aa");
        assert.equal(stringExtended.multiply("a", 3), "aaa");

        assert.equal(stringExtended("a").multiply().value(), "");
        assert.equal(stringExtended("a").multiply(1).value(), "a");
        assert.equal(stringExtended("a").multiply(2).value(), "aa");
        assert.equal(stringExtended("a").multiply(3).value(), "aaa");
    });

    it.should("truncate strings properly", function () {
        assert.equal(stringExtended.truncate("abcdefg", 3), "abc");
        assert.equal(stringExtended.truncate("abcdefg", 3, true), "efg");
        assert.equal(stringExtended.truncate(new Date(1970, 1, 1), 3), "Sun");
        assert.equal(stringExtended.truncate(123, 1), "1");

        assert.equal(stringExtended("abcdefg").truncate(3).value(), "abc");
        assert.equal(stringExtended("abcdefg").truncate(3, true).value(), "efg");
    });


}).as(module).run();


