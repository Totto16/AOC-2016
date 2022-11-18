import { CountFunction, PrintNestedMapFunction } from './utils';

export {};
declare global {
    interface Array<T> {
        equals(array: Array<T>): boolean;
        includesArray<T extends Array<U>, U = unknown>(array: T): boolean;
        printNested(mapFunction?: PrintNestedMapFunction<T>): boolean;
        copy(): Array<T>;
        isArray(): true;
        count(countFunction?: CountFunction<T>, start?: number): number;
        combine(second: Array<T>, flat?: boolean): Array<T>;
        fillElements<U = T>(start?: number, end?: number): Array<U>;
        print(): false | void;
    }
}
