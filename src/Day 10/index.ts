import { start, getFile } from '../utils';

type InstructionCode = 'value' | 'give';

type DestType = 'bot' | 'output';

type Destination = [type: DestType, id: number];

type InstructionMap = {
    value: {
        value: number;
        bot: number;
    };
    give: {
        source: number;
        low: Destination;
        high: Destination;
    };
};

type Instruction<T extends InstructionCode = InstructionCode> = {
    type: T;
} & InstructionMap[T];

function parseInstruction(input: string): Instruction {
    const parser: [InstructionCode, RegExp, (res: RegExpExecArray) => InstructionMap[InstructionCode]][] = [
        [
            'value',
            /value (\d*) goes to bot (\d*)/i,
            ([, value, bot]): InstructionMap['value'] => {
                return { value: parseInt(value), bot: parseInt(bot) };
            },
        ],
        [
            'give',
            /bot (\d*) gives low to (bot|output) (\d*) and high to (bot|output) (\d*)/i,
            ([, source, type, amount, type2, amount2]): InstructionMap['give'] => {
                return {
                    source: parseInt(source),
                    low: [type as DestType, parseInt(amount)],
                    high: [type2 as DestType, parseInt(amount2)],
                };
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
    const isTest = input.length < 10;
    const searchForCompare = isTest ? [2, 5] : [61, 17];
    const bots: number[][] = [];
    const outputs: number[][] = [];
    for (const { type, ...rest } of instructions) {
        if (type === 'value') {
            const { bot, value } = rest as InstructionMap['value'];
            if (bots[bot]?.length >= 2) {
                throw new Error(`Bot ${bot} already has his hands full: ${bots[bot]}`);
            }
            bots[bot] = [...(bots[bot] ?? []), value];
        } else {
            const { source, high, low } = rest as InstructionMap['give'];
            const items = bots[source];
            if (items === undefined || items.length !== 2) {
                instructions.push({ type, ...rest });
                continue;
            }

            if (searchForCompare.equals(items) || searchForCompare.equals(items.reverse())) {
                return source;
            }

            const highIndex = items[0] > items[1] ? 0 : 1;
            const [hType, hID] = high;
            if (hType === 'bot') {
                if (bots[hID]?.length >= 2) {
                    throw new Error(`Bot ${hID} already has his hands full: ${bots[hID]}`);
                }
                bots[hID] = [...(bots[hID] ?? []), items[highIndex]];
            } else {
                outputs[hID] = [...(outputs[hID] ?? []), items[highIndex]];
            }

            const [lType, lID] = low;

            if (lType === 'bot') {
                if (bots[lID]?.length >= 2) {
                    throw new Error(`Bot ${lID} already has his hands full: ${bots[lID]}`);
                }
                bots[lID] = [...(bots[lID] ?? []), items[(highIndex + 1) % 2]];
            } else {
                outputs[lID] = [...(outputs[lID] ?? []), items[(highIndex + 1) % 2]];
            }

            bots[source] = [];
        }
    }

    return -1;
}

function solve2(input: string[]): number {
    const instructions: Instruction[] = input.map(parseInstruction);
    const bots: number[][] = [];
    const outputs: number[][] = [];
    for (const { type, ...rest } of instructions) {
        if (type === 'value') {
            const { bot, value } = rest as InstructionMap['value'];
            if (bots[bot]?.length >= 2) {
                throw new Error(`Bot ${bot} already has his hands full: ${bots[bot]}`);
            }
            bots[bot] = [...(bots[bot] ?? []), value];
        } else {
            const { source, high, low } = rest as InstructionMap['give'];
            const items = bots[source];
            if (items === undefined || items.length !== 2) {
                instructions.push({ type, ...rest });
                continue;
            }

            const highIndex = items[0] > items[1] ? 0 : 1;
            const [hType, hID] = high;
            if (hType === 'bot') {
                if (bots[hID]?.length >= 2) {
                    throw new Error(`Bot ${hID} already has his hands full: ${bots[hID]}`);
                }
                bots[hID] = [...(bots[hID] ?? []), items[highIndex]];
            } else {
                outputs[hID] = [...(outputs[hID] ?? []), items[highIndex]];
            }

            const [lType, lID] = low;

            if (lType === 'bot') {
                if (bots[lID]?.length >= 2) {
                    throw new Error(`Bot ${lID} already has his hands full: ${bots[lID]}`);
                }
                bots[lID] = [...(bots[lID] ?? []), items[(highIndex + 1) % 2]];
            } else {
                outputs[lID] = [...(outputs[lID] ?? []), items[(highIndex + 1) % 2]];
            }

            bots[source] = [];
        }
    }

    try {
        return outputs[0][0] * outputs[1][0] * outputs[2][0];
    } catch (e) {
        //
    }

    return -1;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 2;
    const testResult2 = 30;

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
