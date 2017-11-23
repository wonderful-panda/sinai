import { BG, BM, BA } from './base';
import { assert, identity, getByPath, isPromise } from '../utils';
var ModuleImpl = /** @class */ (function () {
    function ModuleImpl(uid, _a) {
        var state = _a.state, getters = _a.getters, mutations = _a.mutations, actions = _a.actions;
        this.uid = uid;
        this.children = {};
        this.State = state;
        this.Getters = getters;
        this.Mutations = mutations;
        this.Actions = actions;
    }
    ModuleImpl.prototype.initState = function () {
        return this.State ? new this.State() : {};
    };
    ModuleImpl.prototype.initGetters = function (store, transformer) {
        if (transformer === void 0) { transformer = identity; }
        if (!this.Getters)
            return {};
        var getters = new this.Getters(this, store);
        traverseDescriptors(this.Getters.prototype, BG, function (desc, key) {
            if (process.env.NODE_ENV !== 'production') {
                assert(desc.set === undefined, 'Getters should not have any setters');
            }
            if (typeof desc.get === 'function') {
                var original_1 = desc.get;
                desc.get = function boundGetterFn() {
                    return original_1.call(getters);
                };
            }
            else if (typeof desc.value === 'function') {
                var original_2 = desc.value;
                desc.value = function boundGetterFn() {
                    return original_2.apply(getters, arguments);
                };
            }
            else if (process.env.NODE_ENV !== 'production') {
                assert(false, 'Getters should not have other than getter properties or methods');
            }
            Object.defineProperty(getters, key, transformer(desc, key));
        });
        return getters;
    };
    ModuleImpl.prototype.initMutations = function (store, transformer) {
        if (transformer === void 0) { transformer = identity; }
        if (!this.Mutations)
            return {};
        var mutations = new this.Mutations(this, store);
        traverseDescriptors(this.Mutations.prototype, BM, function (desc, key) {
            if (process.env.NODE_ENV !== 'production') {
                assert(typeof desc.value === 'function', 'Mutations should only have functions');
            }
            var original = desc.value;
            desc.value = function boundMutationFn() {
                var r = original.apply(mutations, arguments);
                if (process.env.NODE_ENV !== 'production') {
                    assert(r === undefined, 'Mutations should not return anything');
                }
            };
            Object.defineProperty(mutations, key, transformer(desc, key));
        });
        return mutations;
    };
    ModuleImpl.prototype.initActions = function (store, transformer) {
        if (transformer === void 0) { transformer = identity; }
        if (!this.Actions)
            return {};
        var actions = new this.Actions(this, store);
        traverseDescriptors(this.Actions.prototype, BA, function (desc, key) {
            if (process.env.NODE_ENV !== 'production') {
                assert(typeof desc.value === 'function', 'Actions should only have functions');
            }
            var original = desc.value;
            desc.value = function boundMutationFn() {
                var r = original.apply(actions, arguments);
                if (process.env.NODE_ENV !== 'production') {
                    assert(r === undefined || isPromise(r), 'Actions should not return other than Promise');
                }
                return r;
            };
            Object.defineProperty(actions, key, transformer(desc, key));
        });
        return actions;
    };
    ModuleImpl.prototype.child = function (key, module) {
        if (process.env.NODE_ENV !== 'production') {
            assert(!(key in this.children), key + " is already used in the module");
        }
        this.children[key] = module;
        return this;
    };
    return ModuleImpl;
}());
export { ModuleImpl };
var ModuleProxy = /** @class */ (function () {
    function ModuleProxy(path, store) {
        this.path = path;
        this.store = store;
    }
    Object.defineProperty(ModuleProxy.prototype, "state", {
        get: function () {
            return getByPath(this.path, this.store.state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleProxy.prototype, "getters", {
        get: function () {
            return getByPath(this.path, this.store.getters);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleProxy.prototype, "mutations", {
        get: function () {
            return getByPath(this.path, this.store.mutations);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleProxy.prototype, "actions", {
        get: function () {
            return getByPath(this.path, this.store.actions);
        },
        enumerable: true,
        configurable: true
    });
    return ModuleProxy;
}());
export { ModuleProxy };
var uid = 0;
export function module(options) {
    if (options === void 0) { options = {}; }
    return new ModuleImpl(++uid, options);
}
function traverseDescriptors(proto, Base, fn) {
    if (proto.constructor === Base) {
        return;
    }
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor')
            return;
        var desc = Object.getOwnPropertyDescriptor(proto, key);
        fn(desc, key);
    });
    traverseDescriptors(Object.getPrototypeOf(proto), Base, fn);
}
