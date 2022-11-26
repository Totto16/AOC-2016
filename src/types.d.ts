import { CountFunction, PossibleFillTypes, PrintNestedMapFunction } from './utils';

export {};
declare global {
    interface Array<T> {
        equals(array: Array<T>): boolean;
        includesArray<U = T>(this: Array<Array<U>>, array: Array<U>): boolean;
        printNested<U = T>(this: Array<U> | Array<Array<U>>, mapFunction?: PrintNestedMapFunction<U>): boolean;
        copy(): Array<T>;
        isArray(): true;
        count(countFunction?: CountFunction<T>, startValue?: number): number;
        combine(second: Array<T>, flat?: boolean): Array<T>;
        fillElements(
            this: PossibleFillTypes | T[],
            start?: number,
            end?: number
        ): this extends PossibleFillTypes ? Array<number> : [];
        print(): false | void;
        atSafe(index: number): T;
        indexOfNested<U = T>(this: Array<Array<U>>, element: Array<U>): number;
        times(this: Array<number>, factor: number): Array<number>;
        add(this: Array<number>, number: number): Array<number>;
        add(this: Array<number>, number: Array<number>): Array<number>;
    }

    interface Object {
        isArray(): boolean;
    }
}
