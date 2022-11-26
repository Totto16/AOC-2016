import { start, getFile } from '../utils';

type Direction = 'U' | 'D' | 'L' | 'R';

type Position = [x: number, y: number];

const mappings: { [key in Direction]: [number, number] } = {
    U: [0, -1],
    D: [0, 1],
    L: [-1, 0],
    R: [1, 0],
};

function indexAt<T = number>(array: T[][], index: Position): T {
    return array.atSafe(index[1]).atSafe(index[0]);
}

function solve(input: string[]): string {
    const instructions: Direction[][] = input.map((a) => a.split('') as Direction[]);

    type KeyRow = [number, number, number];
    type KeyPad = [KeyRow, KeyRow, KeyRow];

    const keypad: KeyPad = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];

    let index: Position = [1, 1];
    const result: string[] = [];
    for (const instruction of instructions) {
        for (const dir of instruction) {
            index = index.add(mappings[dir], (a: number): number => a.clamp(0, 3).valueOf()) as Position;
        }
        result.push(indexAt(keypad, index).toString());
    }

    return result.join('');
}

function solve2(input: string[]): string {
    const instructions: Direction[][] = input.map((a) => a.split('') as Direction[]);

    type KeyRow<T> = [T, T, T, T, T];
    type KeyPad<T> = [KeyRow<T>, KeyRow<T>, KeyRow<T>, KeyRow<T>, KeyRow<T>];

    const keypad: KeyPad<number | null | string> = [
        [null, null, 1, null, null],
        [null, 2, 3, 4, null],
        [5, 6, 7, 8, 9],
        [null, 'A', 'B', 'C', null],
        [null, null, 'D', null, null],
    ];

    let index: Position = [0, 2];
    const result: string[] = [];
    for (const instruction of instructions) {
        for (const dir of instruction) {
            const temp = index.add(mappings[dir], (a: number): number => a.clamp(0, 5).valueOf()) as Position;
            const tempContent = indexAt<number | null | string>(keypad, temp);
            if (tempContent !== null) {
                index = temp;
            }
        }
        const content = indexAt<number | null | string>(keypad, index);
        if (content === null) {
            throw new Error(`UNREACHABLE, it can't land here!`);
        }
        result.push(content.toString());
    }

    return result.join('');
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = '1985';
    const testResult2 = '5DB3';

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
