import { start, getFile } from '../utils';
import crypto from 'crypto';

function md5(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex');
}

function solve(input: string[]): string {
    const startString: string = input[0];

    let password = '';
    let i = 0;
    while (true) {
        const result = md5(`${startString}${i}`);
        if (result.startsWith('00000')) {
            password += result[5];
            if (password.length === 8) {
                return password;
            }
        }
        ++i;
        if (i >= Number.MAX_VALUE) {
            throw new Error(`Error: max iterations reached: '${Number.MAX_VALUE}'`);
        }
    }
}

function solve2(input: string[]): string {
    const startString: string = input[0];

    let password = '########';
    let i = 0;
    while (true) {
        const result = md5(`${startString}${i}`);
        if (result.startsWith('00000')) {
            const where = parseInt(result[5]);
            if (where < 0 || where > 7 || isNaN(where) || password[where] !== '#') {
                ++i;
                continue;
            }
            password = password.replaceAt(where, result[6]);
            if (password.count('#'.toStringOfLength<1>(1)) === 0) {
                return password;
            }
        }
        ++i;
        if (i >= Number.MAX_VALUE) {
            throw new Error(`Error: max iterations reached: '${Number.MAX_VALUE}'`);
        }
    }
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = '18f47a30';
    const testResult2 = '05ace8e3';

    const test = solve(testInput);
    if (test !== testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    const test2 = solve2(testInput);
    if (test2 !== testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

start(__filename, { tests: TestBoth, solve, solve2 }, { needsPrototypes: true, slowness: 1 });
