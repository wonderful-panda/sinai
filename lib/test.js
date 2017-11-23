export function stub(Class, injection) {
    if (injection === void 0) { injection = {}; }
    var instance = Object.create(Class.prototype);
    Object.keys(injection).forEach(function (key) {
        Object.defineProperty(instance, key, {
            value: injection[key]
        });
    });
    return instance;
}
