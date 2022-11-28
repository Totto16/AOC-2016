import { start, getFile } from '../utils';

type InstructionCode = 'rect' | 'rotate row' | 'rotate column';

type InstructionMap = {
    rect: {
        width: number;
        height: number;
    };
    'rotate row': {
        row: number;
        amount: number;
    };

    'rotate column': {
        column: number;
        amount: number;
    };
};

type Instruction<T extends InstructionCode = InstructionCode> = {
    type: T;
} & InstructionMap[T];

function parseInstruction(input: string): Instruction {
    const parser: [InstructionCode, RegExp, (res: RegExpExecArray) => InstructionMap[InstructionCode]][] = [
        [
            'rect',
            /rect (\d*)x(\d*)/i,
            ([, width, height]): InstructionMap['rect'] => {
                return { width: parseInt(width), height: parseInt(height) };
            },
        ],
        [
            'rotate row',
            /rotate row y=(\d*) by (\d*)/i,
            ([, row, amount]): InstructionMap['rotate row'] => {
                return { row: parseInt(row), amount: parseInt(amount) };
            },
        ],
        [
            'rotate column',
            /rotate column x=(\d*) by (\d*)/i,
            ([, column, amount]): InstructionMap['rotate column'] => {
                return { column: parseInt(column), amount: parseInt(amount) };
            },
        ],
    ];

    const instruction: Instruction | null = parser.reduce((acc: null | Instruction, [type, regex, mapFn]) => {
        if (acc !== null) {
            return acc;
        }
        const result = regex.exec(input);
        if (result === null) {
            return null;
        }
        const partial = mapFn(result);
        return {
            type,
            ...partial,
        } as Instruction;
    }, null);

    if (instruction === null) {
        throw new Error(`Couldn't parse instruction: '${input}'`);
    }

    return instruction;
}

function solve(input: string[]): number {
    const instructions: Instruction[] = input.map(parseInstruction);
    const fieldSize = [50, 6];

    const screen: boolean[][] = new Array(fieldSize[1])
        .fill(undefined)
        .map(() => new Array(fieldSize[0]).fill(false)) as boolean[][];

    for (const instruction of instructions) {
        switch (instruction.type) {
            case 'rect': {
                const { width, height } = instruction as Instruction<'rect'>;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        screen[y][x] = true;
                    }
                }
                // print screen
                //screen.printNested<boolean>((a) => (a ? '#' : '.'));
                break;
            }
            case 'rotate row': {
                const { row, amount } = instruction as Instruction<'rotate row'>;

                const rowContent = screen[row].copy();

                for (let x = 0; x < fieldSize[0]; ++x) {
                    screen[row][x] = rowContent.atSafe(x - amount);
                }

                // print screen
                //screen.printNested<boolean>((a) => (a ? '#' : '.'));
                break;
            }

            case 'rotate column': {
                const { column, amount } = instruction as Instruction<'rotate column'>;

                const columnContent = screen.copy().map((a) => a[column]);

                for (let y = 0; y < fieldSize[1]; ++y) {
                    screen[y][column] = columnContent.atSafe(y - amount);
                }

                // print screen
                //screen.printNested<boolean>((a) => (a ? '#' : '.'));
                break;
            }

            default:
                throw new Error('UNREACHABLE');
        }
    }
    return screen.count<boolean>((a) => (a ? 1 : 0));
}

function solve2(input: string[], mute = false): number {
    const instructions: Instruction[] = input.map(parseInstruction);
    const fieldSize = [50, 6];

    const screen: boolean[][] = new Array(fieldSize[1])
        .fill(undefined)
        .map(() => new Array(fieldSize[0]).fill(false)) as boolean[][];

    for (const instruction of instructions) {
        switch (instruction.type) {
            case 'rect': {
                const { width, height } = instruction as Instruction<'rect'>;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        screen[y][x] = true;
                    }
                }
                // print screen
                //screen.printNested<boolean>((a) => (a ? '#' : '.'));
                break;
            }
            case 'rotate row': {
                const { row, amount } = instruction as Instruction<'rotate row'>;

                const rowContent = screen[row].copy();

                for (let x = 0; x < fieldSize[0]; ++x) {
                    screen[row][x] = rowContent.atSafe(x - amount);
                }

                // print screen
                //screen.printNested<boolean>((a) => (a ? '#' : '.'));
                break;
            }

            case 'rotate column': {
                const { column, amount } = instruction as Instruction<'rotate column'>;

                const columnContent = screen.copy().map((a) => a[column]);

                for (let y = 0; y < fieldSize[1]; ++y) {
                    screen[y][column] = columnContent.atSafe(y - amount);
                }

                // print screen
                //screen.printNested<boolean>((a) => (a ? '#' : '.'));
                break;
            }

            default:
                throw new Error('UNREACHABLE');
        }
    }

    if (!mute) {
        // let the user "parse" this himself, it's to much work to convert this 😅
        // my input has 'ZJHRKCPLYJ' as result
        screen.printNested<boolean>((a) => (a ? '#' : ' '));
    }
    return screen.count<boolean>((a) => (a ? 1 : 0));
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 6;
    const testResult2 = 6;

    const test = solve(testInput);
    if (test !== testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    const test2 = solve2(testInput, true);
    if (test2 !== testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

start(__filename, { tests: TestBoth, solve, solve2 }, { needsPrototypes: true });
