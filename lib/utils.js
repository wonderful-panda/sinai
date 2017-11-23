export function assert(condition, message) {
    if (!condition) {
        throw new Error('[sinai] ' + message);
    }
}
export function identity(value) {
    return value;
}
export function forEachValues(t, fn) {
    Object.keys(t).forEach(function (key) {
        fn(t[key], key);
    });
}
export function getByPath(path, obj) {
    return path.reduce(function (acc, key) { return acc[key]; }, obj);
}
export function bind(obj, fn) {
    return function boundFn() {
        return fn.apply(obj, arguments);
    };
}
export function isPromise(p) {
    return p != null && typeof p.then === 'function';
}
