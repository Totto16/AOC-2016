import { CountFunction, PossibleFillTypes, PrintNestedMapFunction } from './utils';

export {};
declare global {
    interface Array<T> {
        equals(this: Array<T>, array: Array<T>): boolean;
        includesArray(this: Array<Array<T>>, array: Array<T>): boolean;
        printNested(this: Array<T> | Array<Array<T>>, mapFunction?: PrintNestedMapFunction<T>): boolean;
        copy(this: Array<T>): Array<T>;
        isArray(this: Array<T>): true;
        count(this: Array<T>, countFunction?: CountFunction<T>, startValue?: number): number;
        combine(this: Array<T>, second: Array<T>, flat?: boolean): Array<T>;
        fillElements(this: PossibleFillTypes, start?: number, end?: number): Array<number>;
        print(this: Array<T>): false | void;
        atSafe(index: number): T;
    }
}
