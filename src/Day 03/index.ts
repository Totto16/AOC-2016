import { start, getFile } from '../utils';

type Triangle = [a: number, b: number, c: number];

function isTriangle(triangle: Triangle): boolean {
    return triangle.reduce((acc, _, index) => {
        const validLengths = triangle.atSafe(index - 2) < triangle.atSafe(index - 1) + triangle.atSafe(index);
        return acc && validLengths;
    }, true);
}

function solve(input: string[]): number {
    const triangles: Triangle[] = input.map(
        (a) =>
            a
                .split(' ')
                .filter((c) => c !== '')
                .map((b) => parseInt(b.trim())) as Triangle
    );

    let sum = 0;
    for (const triangle of triangles) {
        sum += isTriangle(triangle) ? 1 : 0;
    }

    return sum;
}

function solve2(input: string[]): number {
    const rawTriangles: Triangle[] = input.map(
        (a) =>
            a
                .split(' ')
                .filter((c) => c !== '')
                .map((b) => parseInt(b.trim())) as Triangle
    );
    if (rawTriangles.length % 3 !== 0) {
        throw new Error('Not parsable input!');
    }
    const triangles: Triangle[] = [];
    for (let i = 0; i < rawTriangles.length; i += 3) {
        const vertTriangles: [Triangle, Triangle, Triangle] = rawTriangles.slice(i, i + 3) as [
            Triangle,
            Triangle,
            Triangle
        ];
        const parsedTriangles: [Triangle, Triangle, Triangle] = vertTriangles.reduce(
            (acc: [number[], number[], number[]], [a, b, c]) => {
                acc[0].push(a);
                acc[1].push(b);
                acc[2].push(c);
                return acc;
            },
            [[], [], []]
        ) as [Triangle, Triangle, Triangle];
        triangles.push(...parsedTriangles);
    }

    let sum = 0;
    for (const triangle of triangles) {
        sum += isTriangle(triangle) ? 1 : 0;
    }

    return sum;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);
    const testInput2 = getFile('./sample2.txt', __filename);

    const testResult = 0;
    const testResult2 = 6;

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
