import { start, getFile } from '../utils';

type Direction = 'R' | 'L';
type Path = [Direction, number];
type Facing = [0, 1] | [1, 0] | [0, -1] | [-1, 0];
type Position = [number, number];

function solve(input: string[]): number {
    const paths: Path[] = input[0]
        .split(',')
        .map((a: string) => a.trim())
        .map((a: string) => {
            const dir = a[0] as Direction;
            const num = parseInt(a.substring(1));
            return [dir, num];
        });

    const currentPos: [...Position, Facing] = [0, 0, [0, 1]];
    for (const [dir, num] of paths) {
        const dirVector = changeDir(currentPos[2], dir);
        currentPos[2] = dirVector;
        const toWalk: number[] = dirVector.times(num);
        currentPos[0] += toWalk[0];
        currentPos[1] += toWalk[1];
    }

    return Math.abs(currentPos[0]) + Math.abs(currentPos[1]);
}

function changeDir(input: Facing, dir: Direction): Facing {
    const table: Facing[] = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    const index: number = table.indexOfNested<number>(input);
    if (dir === 'R') {
        return table.atSafe((index + 1) % table.length);
    } else {
        return table.atSafe((index - 1) % table.length);
    }
}

function solve2(input: string[]) {
    const paths: Path[] = input[0]
        .split(',')
        .map((a: string) => a.trim())
        .map((a: string) => {
            const dir = a[0] as Direction;
            const num = parseInt(a.substring(1));
            return [dir, num];
        });

    const currentPos: [...Position, Facing] = [0, 0, [0, 1]];
    const visitedPlaces: Position[] = [[0, 0]];
    for (const [dir, num] of paths) {
        const dirVector = changeDir(currentPos[2], dir);
        currentPos[2] = dirVector;

        for (let i = 1; i <= num; ++i) {
            const currentP: Position = (currentPos.slice(0, 2) as number[]).add(dirVector.times(i)) as Position;
            const isHere = visitedPlaces.includesArray<number>(currentP);
            if (isHere) {
                return Math.abs(currentP[0]) + Math.abs(currentP[1]);
            } else {
                visitedPlaces.push(currentP);
            }
        }

        const toWalk: number[] = dirVector.times(num);
        currentPos[0] += toWalk[0];
        currentPos[1] += toWalk[1];

        const currentP: Position = currentPos.slice(0, 2) as Position;
        visitedPlaces.push(currentP);
    }

    return -1;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);
    const testInput2 = getFile('./sample2.txt', __filename);

    const testResult = 12;
    const testResult2 = 4;

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
