import path from 'path';
import fs from 'fs';
const debug = (process.env['DEBUG'] ?? '1') === '1';

function logDebug(...args: unknown[]) {
    if (debug) {
        console.log(`[DEBUG] `, ...args);
        return true;
    }
    return false;
}

function getFile(filePath: string, filename: string | undefined, separator = '\n', filterOutEmptyLines = true) {
    const dirname = path.dirname(filename ?? __filename);
    const file = path.join(dirname, filePath);
    let result = fs
        .readFileSync(file)
        .toString()
        .split(separator)
        .filter((a: string) => !filterOutEmptyLines || a !== '');
    if (result.some((a: string) => a.split('').includes('\r'))) {
        result = result.map((a: string) => a.replaceAll(/\r/g, ''));
    }
    return result;
}

export type PrintNestedMapFunction<T = unknown> = (a: T) => string;

export type CountFunction<T = unknown> = (a: T) => number;

function initPrototypes() {
    //some useful Functions, copy from Day 09 and further along to have all useful functions on Arrays
    Object.defineProperty(Array.prototype, 'equals', {
        value(this: unknown[], second: unknown[], amount = -1) {
            // eslint-disable-next-line this/no-this, @typescript-eslint/no-this-alias
            const first = this;
            if (!Array.isArray(first) || !Array.isArray(second)) {
                return false;
            }
            if (amount > 0) {
                const length = first.length === second.length ? first.length : Math.min(first.length, second.length);
                if (length < amount) {
                    return false;
                }
                for (let i = 0; i < amount; i++) {
                    if (first[i] !== second[i]) {
                        return false;
                    }
                }
                return true;
            }
            return first.length === second.length && first.every((a, index) => a === second[index]);
        },
    });

    Object.defineProperty(Array.prototype, 'includesArray', {
        value(this: unknown[][], singleArray: unknown[]): boolean {
            // eslint-disable-next-line this/no-this, @typescript-eslint/no-this-alias
            const BigArray = this;
            return BigArray.reduce<boolean>((acc: boolean, cnt: unknown[]): boolean => {
                return cnt.equals(singleArray) || acc;
            }, false);
        },
    });

    Object.defineProperty(Array.prototype, 'printNested', {
        value(
            this: unknown[],
            mapFunction: PrintNestedMapFunction = (a: unknown): string => (a === 0 ? '.' : a.toString()),
            seperator = ' ',
            EOL = '\n'
        ) {
            // eslint-disable-next-line this/no-this, @typescript-eslint/no-this-alias
            const array = this;
            let error = false;
            const toLog = array
                .map((a) => {
                    if (!Array.isArray(a)) {
                        error = true;
                    }
                    return a.map((b: any) => mapFunction(b)).join(seperator);
                })
                .join(EOL);
            if (error) {
                return false;
            }
            console.log(toLog);
            return true;
        },
    });

    Object.defineProperty(Array.prototype, 'copy', {
        value(this: unknown[]): Array<unknown> {
            // eslint-disable-next-line this/no-this
            return JSON.parse(JSON.stringify(this)) as Array<unknown>;
        },
    });

    Object.defineProperty(Array.prototype, 'isArray', {
        value() {
            return true;
        },
    });

    Object.defineProperty(Array.prototype, 'count', {
        value(this: unknown[], countFunction = (a) => a, start = 0) {
            // eslint-disable-next-line this/no-this, @typescript-eslint/no-this-alias
            const array = this;
            const reduceFunction = (acc, el) => {
                if (!Array.isArray(el)) {
                    return acc + countFunction(el);
                }
                return acc + el.reduce(reduceFunction, start);
            };

            const result = array.reduce(reduceFunction, start);
            return result;
        },
    });

    Object.defineProperty(Array.prototype, 'combine', {
        value(this: unknown[], second: unknown[], flat = true) {
            // eslint-disable-next-line this/no-this, @typescript-eslint/no-this-alias
            const first = this;
            if (!Array.isArray(first) || !Array.isArray(second)) {
                return [];
            }
            const result = [];
            for (let i = 0; i < first.length; i++) {
                for (let j = 0; j < second.length; j++) {
                    let p = [first[i], second[j]];
                    if (flat && (Array.isArray(first[i]) || Array.isArray(second[j]))) {
                        p = p.flat();
                    }
                    result.push(p);
                }
            }
            return result;
        },
    });

    Object.defineProperty(Array.prototype, 'fillElements', {
        value(this: unknown[], start = 0, end = 1000) {
            // eslint-disable-next-line this/no-this, @typescript-eslint/no-this-alias
            const first = this;
            if (!Array.isArray(first)) {
                return [];
            }
            if (first.length > 3) {
                return first;
            }
            const newArray = [];
            for (let i = 0; i < first.length; i++) {
                if (first[i] === '..') {
                    const startNumber = i > 0 ? first[i - 1] : start;
                    const endNumber = i < first.length - 1 ? first[i + 1] : end;
                    const diff = endNumber >= startNumber ? 1 : -1;
                    const compareFunction = endNumber >= startNumber ? (a, b) => a <= b : (a, b) => a >= b;
                    for (let j = startNumber; compareFunction(j, endNumber); j += diff) {
                        newArray.push(j);
                    }
                }
            }
            return newArray;
        },
    });

    Object.defineProperty(Array.prototype, 'print', {
        value(this: unknown[]) {
            try {
                // eslint-disable-next-line this/no-this
                const toPrint = JSON.stringify(this);
                console.log(toPrint);
            } catch (e) {
                return false;
            }
            return;
        },
    });
}
export type WarningType = 0 | 1 | 2;

function slowWarning(type: WarningType) {
    process.on('SIGINT', () => {
        if (process.connected) {
            process.disconnect();
        }
        process.exit(0);
    });
    const message = type === 0 ? 'Attention: Moderately Slow' : type === 1 ? 'ATTENTION: SLOW' : 'Unknown Slow Type';
    const level = type === 0 ? 'moderate' : type === 1 ? 'severe' : 'unknown';
    return sendIpc({ type: 'slow', message, level });
}

export type IPCTypes = 'slow';

export type IPCLevel = 'moderate' | 'severe' | 'unknown';
export interface IPCOptions {
    type: IPCTypes;
    message: string;
    level: IPCLevel;
}

function sendIpc(options: IPCOptions | string) {
    if (process.send) {
        if (typeof options !== 'string') {
            options = JSON.stringify(options);
        }
        process.send(options);
        return true;
    }
    logDebug(options);
    return false;
}

function start(filename, methods, options) {
    options = options || {};
    sendIpc({ type: 'time', what: 'start' });
    const args = parseArgs();
    logDebug(`parsed argv: `, args, 'real argv:', process.argv);
    if (options.needsPrototypes) {
        initPrototypes();
    }

    if (methods.tests && !args.no_tests) {
        methods.tests(args.mute);
        sendIpc({ type: 'time', what: 'tests' });
    }
    if (options.slowness !== undefined && args.skipSlow) {
        sendIpc({ type: 'message', message: 'Auto Skipped Moderately Slow\n' });
        process.exit(43);
    }
    if (options.slowness !== undefined) {
        slowWarning(options.slowness);
    }
    filename = filename ?? __filename;
    const { seperator, filterOutEmptyLines } = options.inputOptions || { seperator: '\n', filterOutEmptyLines: true };
    if (methods.solve) {
        const realInput = getFile('./input.txt', filename, seperator, filterOutEmptyLines);
        const Answer = methods.solve(realInput);
        sendIpc({ type: 'message', message: `Part 1: '${Answer}'\n` });
        sendIpc({ type: 'time', what: 'part1' });
    } else if (methods.solveMessage) {
        sendIpc({ type: 'message', message: `Part 1: '${methods.solveMessage}\n'` });
        sendIpc({ type: 'time', what: 'part1' });
    }

    if (methods.solve2) {
        const realInput2 = getFile('./input.txt', filename, seperator, filterOutEmptyLines);
        const Answer2 = methods.solve2(realInput2);
        sendIpc({ type: 'message', message: `Part 2: '${Answer2}'\n` });
        sendIpc({ type: 'time', what: 'part2' });
    } else if (methods.solve2Message) {
        sendIpc({ type: 'message', message: `Part 2: '${methods.solve2Message}'\n` });
        sendIpc({ type: 'time', what: 'part2' });
    }

    process.exit(0);
}

module.exports = { start, getFile };
