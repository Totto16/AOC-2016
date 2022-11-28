import { start, getFile } from '../utils';

function decompress(input: string): string {
    let remaining = input;
    let result = '';
    while (remaining.length !== 0) {
        const matched = /^([^(]*)\((\d*)x(\d*)\)/.exec(remaining);
        if (matched === null) {
            result += remaining;
            remaining = '';
        } else {
            const [everything, before, _amount, _repeat] = matched;

            const amount = parseInt(_amount);
            const repeat = parseInt(_repeat);
            result += before;
            const toRepeat = remaining.substring(everything.length, everything.length + amount);
            result += toRepeat.repeat(repeat);
            remaining = remaining.substring(everything.length + amount);
        }
    }
    return result;
}

function decompressLength(input: string): number {
    let remaining = input;
    let result = 0;
    while (remaining.length !== 0) {
        const matched = /^([^(]*)\((\d*)x(\d*)\)/.exec(remaining);
        if (matched === null) {
            result += remaining.length;
            remaining = '';
        } else {
            const [everything, before, _amount, _repeat] = matched;
            const amount = parseInt(_amount);
            const repeat = parseInt(_repeat);
            result += before.length;
            const toRepeat = remaining.substring(everything.length, everything.length + amount);
            result += decompressLength(toRepeat) * repeat;
            remaining = remaining.substring(everything.length + amount);
        }
    }
    return result;
}

function solve(input: string[]): number {
    const result = decompress(input[0]);
    return result.length;
}

function solve2(input: string[]): number {
    const result = decompressLength(input[0]);
    return result;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);
    const testInput2 = getFile('./sample2.txt', __filename);

    const testResult = 57;
    const testResult2 = 241920;

    const test = solve(testInput);
    if (test !== testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    const test2 = solve2(testInput2);
    if (test2 !== testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

start(__filename, { tests: TestBoth, solve, solve2 }, { needsPrototypes: true });
