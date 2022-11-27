import { start, getFile } from '../utils';

type CharCount = [char: string, amount: number];

function solve(input: string[]): string {
    let result = '';
    for (let i = 0; i < input[0].length; ++i) {
        let rawChars = '';
        for (let j = 0; j < input.length; ++j) {
            rawChars += input[j][i];
        }

        const charCount: CharCount[] = [];
        for (const char of rawChars) {
            const count = rawChars.count(char.toStringOfLength<1>(1));
            if (charCount.indexOfNested([char, count]) === -1) {
                charCount.push([char, count]);
            }
        }

        charCount.sort(([charA, countA], [charB, countB]) => {
            if (countA !== countB) {
                return countB - countA;
            }
            return charA.charCodeAt(0) - charB.charCodeAt(0);
        });

        result += charCount[0][0];
    }
    return result;
}

function solve2(input: string[]): string {
    let result = '';
    for (let i = 0; i < input[0].length; ++i) {
        let rawChars = '';
        for (let j = 0; j < input.length; ++j) {
            rawChars += input[j][i];
        }

        const charCount: CharCount[] = [];
        for (const char of rawChars) {
            const count = rawChars.count(char.toStringOfLength<1>(1));
            if (charCount.indexOfNested([char, count]) === -1) {
                charCount.push([char, count]);
            }
        }

        charCount.sort(([charA, countA], [charB, countB]) => {
            if (countA !== countB) {
                return countB - countA;
            }
            return charA.charCodeAt(0) - charB.charCodeAt(0);
        });

        result += charCount.atSafe(-1)[0];
    }
    return result;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 'easter';
    const testResult2 = 'advent';

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

start(__filename, { tests: TestBoth, solve, solve2 }, { needsPrototypes: true });
