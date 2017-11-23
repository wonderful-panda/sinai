export interface Class<R> {
    new (...args: any[]): R;
}
export interface Dictionary<T> {
    [key: string]: T;
}
export declare type CHD<K extends string, T> = {
    [_ in K]: T;
};
export declare function assert(condition: any, message: string): void;
export declare function identity<T>(value: T): T;
export declare function forEachValues<T>(t: Dictionary<T>, fn: (t: T, key: string) => void): void;
export declare function getByPath<T>(path: string[], obj: any): T;
export declare function bind<T extends Function>(obj: any, fn: T): T;
export declare function isPromise(p: any): p is Promise<any>;
