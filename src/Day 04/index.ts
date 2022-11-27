import { start, getFile } from '../utils';

type CharCount = [char: string, amount: number];

type Room = [name: string, charMap: CharCount[], roomID: number, checksum: string];

function isRealRoom(room: Room): boolean {
    const [, charCount, , checksum] = room;
    const firstFive: string[] = charCount.slice(0, 5).map(([char]) => char);
    return checksum.split('').reduce((acc, char) => acc && firstFive.includes(char), true);
}

function parseRooms(input: string[]) {
    const rooms: Room[] = input.map((a) => {
        const regex = /^([\w\-]*)-(\d*)\[(\w{5})\]$/g;

        const matchResult = regex.exec(a);

        if (matchResult === null) {
            throw new Error(`'${a}' is not a valid room!`);
        }

        const [, allNames, roomID, checksum] = matchResult;
        const rawChars = allNames.replaceAll('-', '');
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

        return [allNames, charCount, parseInt(roomID), checksum] as Room;
    });

    return rooms;
}

function solve(input: string[]): number {
    const rooms: Room[] = parseRooms(input);

    let sum = 0;
    for (const room of rooms) {
        if (isRealRoom(room)) {
            sum += room[2];
        }
    }

    return sum;
}

function shiftCypher(toShift: string, amount: number): string {
    const shiftAmount = amount % 26;
    const aChar = 'a'.toCharCode();
    const zChar = 'z'.toCharCode();
    return toShift
        .split('')
        .map((a) => {
            const char = a.toCharCode();
            if (char >= aChar && char <= zChar) {
                let result = (char + shiftAmount) % (zChar + 1);
                if (result < aChar) {
                    result += aChar;
                }
                return String.fromCharCode(result);
            }

            if (a === '-') {
                return ' ';
            }

            throw new Error(`Can't shift char: '${a}'`);
        })
        .join('');
}

function solve2(input: string[]): number {
    const rooms: Room[] = parseRooms(input);

    for (const room of rooms) {
        if (isRealRoom(room)) {
            const name = shiftCypher(room[0], room[2]);
            if (name === 'northpole object storage') {
                return room[2];
            }
        }
    }

    return -1;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 1514;
    const testResult2 = -1;

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
