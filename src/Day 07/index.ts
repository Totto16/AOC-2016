import { start, getFile } from '../utils';

type SequenceType = 'normal' | 'hypernet';

type IPv7 = [normal: string[], hypernet: string[]];

function parseIPv7(input: string): IPv7 {
    const matches = [...input.matchAll(/\[(\w+)\]|(\w+)/g)];
    const ip: IPv7 = [[], []];
    for (const match of matches) {
        const [all, hypernet, normal] = match as [string, string | undefined, string | undefined];
        if (normal !== undefined) {
            ip[0].push(normal);
        } else if (hypernet !== undefined) {
            ip[1].push(hypernet);
        } else {
            throw new Error(`the matched string '${all}' wasn't a valid Sequence`);
        }
    }

    return ip;
}

function supportsTLS(ip: IPv7): boolean {
    const [normal, hypernet] = ip;
    let normalHasABBA = false;
    for (const norm of normal) {
        for (let i = 0; i < norm.length - 3; ++i) {
            const toLook = norm.substring(i, i + 4);
            const splitted = toLook.split('');
            if (splitted.slice(0, 2).equals(splitted.slice(2, 4).reverse()) && splitted[0] !== splitted[1]) {
                normalHasABBA = true;
                break;
            }
        }
    }

    if (!normalHasABBA) {
        return false;
    }

    for (const hyper of hypernet) {
        for (let i = 0; i < hyper.length - 3; ++i) {
            const toLook = hyper.substring(i, i + 4);
            const splitted = toLook.split('');
            if (splitted.slice(0, 2).equals(splitted.slice(2, 4).reverse()) && splitted[0] !== splitted[1]) {
                return false;
            }
        }
    }

    return true;
}

function supportsSSL(ip: IPv7): boolean {
    const [normal, hypernet] = ip;
    const normalABA: string[] = [];
    for (const norm of normal) {
        for (let i = 0; i < norm.length - 2; ++i) {
            const toLook = norm.substring(i, i + 3);
            const splitted = toLook.split('');
            if (splitted[0] === splitted[2] && splitted[0] !== splitted[1]) {
                normalABA.push(toLook);
            }
        }
    }

    if (normalABA.length === 0) {
        return false;
    }

    for (const hyper of hypernet) {
        for (let i = 0; i < hyper.length - 2; ++i) {
            const toLook = hyper.substring(i, i + 3);
            const splitted = toLook.split('');
            if (splitted[0] === splitted[2] && splitted[0] !== splitted[1]) {
                const ABA = [splitted[1], splitted[0], splitted[1]].join('');
                if (normalABA.includes(ABA)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function solve(input: string[]): number {
    const ips: IPv7[] = input.map(parseIPv7);
    let sum = 0;
    for (const ip of ips) {
        if (supportsTLS(ip)) {
            ++sum;
        }
    }
    return sum;
}

function solve2(input: string[]): number {
    const ips: IPv7[] = input.map(parseIPv7);
    let sum = 0;
    for (const ip of ips) {
        if (supportsSSL(ip)) {
            ++sum;
        }
    }
    return sum;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);
    const testInput2 = getFile('./sample2.txt', __filename);

    const testResult = 2;
    const testResult2 = 3;

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
