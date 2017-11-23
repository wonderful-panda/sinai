/*!
 * Sinai v0.1.6
 * https://github.com/ktsn/sinai
 *
 * @license
 * Copyright (c) 2017 katashin
 * Released under the MIT license
 * https://github.com/ktsn/sinai/blob/master/LICENSE
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function assert(condition, message) {
    if (!condition) {
        throw new Error('[sinai] ' + message);
    }
}
function identity(value) {
    return value;
}
function forEachValues(t, fn) {
    Object.keys(t).forEach(function (key) {
        fn(t[key], key);
    });
}
function getByPath(path, obj) {
    return path.reduce(function (acc, key) { return acc[key]; }, obj);
}
function bind(obj, fn) {
    return function boundFn() {
        return fn.apply(obj, arguments);
    };
}
function isPromise(p) {
    return p != null && typeof p.then === 'function';
}

function makeInjected(Getters, Mutations, Actions) {
    return {
        Getters: function () { return Getters; },
        Mutations: function () { return Mutations; },
        Actions: function () { return Actions; },
        and: function (key, module) {
            return makeInjected(injectModule(Getters, key, module), Mutations, injectModule(Actions, key, module));
        }
    };
}
function injectModule(Super, key, depModule) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1(module, store) {
            var _this = _super.call(this, module, store) || this;
            var proxy = store.getProxy(depModule);
            if (process.env.NODE_ENV !== 'production') {
                assert(proxy !== null, 'The dependent module is not found in the store');
            }
            _this.modules[key] = proxy;
            return _this;
        }
        return class_1;
    }(Super));
}
var Base = /** @class */ (function () {
    function Base(module, store) {
        var proxy = store.getProxy(module);
        if (process.env.NODE_ENV !== 'production') {
            assert(proxy !== null, 'The module proxy is not found in the store, unexpectedly');
        }
        this.__proxy__ = proxy;
    }
    return Base;
}());
var BaseInjectable = /** @class */ (function (_super) {
    __extends(BaseInjectable, _super);
    function BaseInjectable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modules = {};
        return _this;
    }
    return BaseInjectable;
}(Base));
var BG = /** @class */ (function (_super) {
    __extends(BG, _super);
    function BG() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BG.prototype, "state", {
        get: function () {
            return this.__proxy__.state;
        },
        enumerable: true,
        configurable: true
    });
    return BG;
}(BaseInjectable));
var BM = /** @class */ (function (_super) {
    __extends(BM, _super);
    function BM() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BM.prototype, "state", {
        get: function () {
            return this.__proxy__.state;
        },
        enumerable: true,
        configurable: true
    });
    return BM;
}(Base));
var BA = /** @class */ (function (_super) {
    __extends(BA, _super);
    function BA() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BA.prototype, "state", {
        get: function () {
            return this.__proxy__.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BA.prototype, "getters", {
        get: function () {
            return this.__proxy__.getters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BA.prototype, "mutations", {
        get: function () {
            return this.__proxy__.mutations;
        },
        enumerable: true,
        configurable: true
    });
    return BA;
}(BaseInjectable));
function Getters() {
    return BG;
}
function Mutations() {
    return BM;
}
function Actions() {
    return BA;
}
function inject(key, module) {
    return makeInjected(BG, BM, BA).and(key, module);
}

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
var uid = 0;
function module$1(options) {
    if (options === void 0) { options = {}; }
    return new ModuleImpl(++uid, options);
}
function traverseDescriptors(proto, Base$$1, fn) {
    if (proto.constructor === Base$$1) {
        return;
    }
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor')
            return;
        var desc = Object.getOwnPropertyDescriptor(proto, key);
        fn(desc, key);
    });
    traverseDescriptors(Object.getPrototypeOf(proto), Base$$1, fn);
}

/**
 * Convert Vuex plugin to Sinai plugin
 */
function convertVuexPlugin(plugin) {
    return function (store) {
        var storeAdapter = {
            get state() {
                return store.state;
            },
            get getters() {
                return flattenGetters(store.getters, '/');
            },
            replaceState: function (state) {
                store.replaceState(state);
            },
            dispatch: function (type, payload) {
                if (typeof type !== 'string') {
                    payload = type;
                    type = payload.type;
                }
                var path = type.split('/');
                var action = path.reduce(function (action, key) {
                    return action[key];
                }, store.actions);
                var res = action(payload);
                if (isPromise(res)) {
                    return res;
                }
                else {
                    return Promise.resolve(res);
                }
            },
            commit: function (type, payload) {
                if (typeof type !== 'string') {
                    payload = type;
                    type = payload.type;
                }
                var path = type.split('/');
                var mutation = path.reduce(function (mutation, key) {
                    return mutation[key];
                }, store.mutations);
                mutation(payload);
            },
            subscribe: function (fn) {
                return store.subscribe(function (path, payload, state) {
                    var type = path.join('/');
                    fn({
                        type: type,
                        payload: payload[0]
                    }, state);
                });
            },
            watch: function (getter, cb, options) {
                var _this = this;
                return store.watch(function () { return getter(_this.state, _this.getters); }, cb, options);
            },
            registerModule: function () {
                throw new Error('[sinai:vuex-plugin-adapter] registerModule is not supported');
            },
            unregisterModule: function () {
                throw new Error('[sinai:vuex-plugin-adapter] unregisterModule is not supported');
            }
        };
        plugin(storeAdapter);
    };
}
function flattenGetters(getters, sep) {
    function loop(acc, path, getters) {
        Object.keys(getters).forEach(function (key) {
            if (key === '__proxy__' || key === 'modules') {
                return;
            }
            if (!(getters[key].__proto__ instanceof BG)) {
                Object.defineProperty(acc, path.concat(key).join(sep), {
                    get: function () { return getters[key]; },
                    enumerable: true,
                    configurable: true
                });
            }
            else {
                loop(acc, path.concat(key), getters[key]);
            }
        });
        return acc;
    }
    return loop({}, [], getters);
}

var StoreImpl = /** @class */ (function () {
    function StoreImpl(module, options) {
        if (options === void 0) { options = {}; }
        this.moduleMap = {};
        this.subscribers = [];
        this.transformGetter = options.transformGetter || identity;
        this.transformMutation = options.transformMutation || identity;
        this.transformAction = options.transformAction || identity;
        this.registerModule(module, false);
    }
    StoreImpl.prototype.replaceState = function (state) {
        this.state = state;
    };
    StoreImpl.prototype.subscribe = function (fn) {
        var _this = this;
        this.subscribers.push(fn);
        return function () {
            _this.subscribers.splice(_this.subscribers.indexOf(fn), 1);
        };
    };
    StoreImpl.prototype.registerModule = function (module, isHot) {
        this.registerModuleLoop([], module);
        var assets = this.initModuleAssets([], module);
        if (!isHot) {
            this.state = assets.state;
        }
        this.getters = assets.getters;
        this.mutations = assets.mutations;
        this.actions = assets.actions;
    };
    StoreImpl.prototype.getProxy = function (module) {
        var map = this.moduleMap[module.uid];
        if (map == null)
            return null;
        return map.proxy;
    };
    StoreImpl.prototype.hotUpdate = function (module) {
        this.moduleMap = {};
        this.registerModule(module, true);
    };
    StoreImpl.prototype.registerModuleLoop = function (path, module) {
        var _this = this;
        if (process.env.NODE_ENV !== 'production') {
            assert(!(module.uid in this.moduleMap), 'The module is already registered. The module object must not be re-used in twice or more');
        }
        this.moduleMap[module.uid] = {
            path: path,
            module: module,
            proxy: new ModuleProxy(path, this)
        };
        Object.keys(module.children).forEach(function (name) {
            _this.registerModuleLoop(path.concat(name), module.children[name]);
        });
    };
    StoreImpl.prototype.initModuleAssets = function (path, module) {
        var _this = this;
        var assets = {
            state: module.initState(),
            getters: module.initGetters(this, chainTransformer(path, this.transformGetter)),
            mutations: module.initMutations(this, chainTransformer(path, bind(this, this.hookMutation))),
            actions: module.initActions(this, chainTransformer(path, this.transformAction))
        };
        forEachValues(module.children, function (childModule, key) {
            var child = _this.initModuleAssets(path.concat(key), childModule);
            assets.state[key] = child.state;
            assets.getters[key] = child.getters;
            assets.mutations[key] = child.mutations;
            assets.actions[key] = child.actions;
        });
        return assets;
    };
    StoreImpl.prototype.hookMutation = function (desc, path) {
        var _this = this;
        // desc.value must be a Function since
        // it should be already checked in each module
        var original = desc.value;
        desc.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            original.apply(void 0, args);
            _this.subscribers.forEach(function (fn) { return fn(path, args, _this.state); });
        };
        return this.transformMutation(desc, path);
    };
    return StoreImpl;
}());
function chainTransformer(path, transform) {
    return function chainedTransformer(desc, name) {
        return transform(desc, path.concat(name));
    };
}

var devtoolHook = typeof window !== 'undefined' &&
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/**
 * Mimic Vuex to use the vue-devtools feature
 */
function devtoolPlugin(store) {
    if (!devtoolHook) {
        return;
    }
    devtoolHook.emit('vuex:init', proxyStore(store));
    devtoolHook.on('vuex:travel-to-state', function (targetState) {
        store.replaceState(targetState);
    });
    store.subscribe(function (path, payload, state) {
        devtoolHook.emit('vuex:mutation', { type: path.join('.'), payload: payload }, state);
    });
}
function proxyStore(store) {
    return {
        get state() {
            return store.state;
        },
        getters: flattenGetters(store.getters, '.')
    };
}

var _Vue;
var VueStoreImpl = /** @class */ (function () {
    function VueStoreImpl(module, options) {
        var _this = this;
        this.gettersForComputed = {};
        if (process.env.NODE_ENV !== 'production') {
            assert(_Vue, 'Must install Sinai by Vue.use before instantiate a store');
        }
        this.strict = Boolean(options.strict);
        this.innerStore = new StoreImpl(module, {
            transformGetter: bind(this, this.transformGetter),
            transformMutation: bind(this, this.transformMutation)
        });
        this.setupStoreVM();
        this.watcher = new _Vue();
        // Override the innerStore's state to point to VueStore's state
        // The state can do not be reactive sometimes if not do this
        Object.defineProperty(this.innerStore, 'state', {
            get: function () { return _this.state; },
            set: function (value) {
                _this.vm.$data.state = value;
            }
        });
        if (this.strict) {
            this.watch(function (state) { return state; }, function () {
                assert(!_this.strict, 'Must not update state out of mutations when strict mode is enabled.');
            }, { deep: true, sync: true });
        }
        var plugins = options.plugins || [];
        if (process.env.NODE_ENV !== 'production' && _Vue.config.devtools) {
            plugins.push(devtoolPlugin);
        }
        plugins.forEach(function (plugin) { return plugin(_this); });
    }
    Object.defineProperty(VueStoreImpl.prototype, "state", {
        get: function () {
            return this.vm.$data.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VueStoreImpl.prototype, "getters", {
        get: function () {
            return this.innerStore.getters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VueStoreImpl.prototype, "mutations", {
        get: function () {
            return this.innerStore.mutations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VueStoreImpl.prototype, "actions", {
        get: function () {
            return this.innerStore.actions;
        },
        enumerable: true,
        configurable: true
    });
    VueStoreImpl.prototype.replaceState = function (state) {
        var _this = this;
        this.commit(function () {
            _this.vm.$data.state = state;
        });
    };
    VueStoreImpl.prototype.subscribe = function (fn) {
        return this.innerStore.subscribe(fn);
    };
    VueStoreImpl.prototype.watch = function (getter, cb, options) {
        var _this = this;
        return this.watcher.$watch(function () { return getter(_this.state, _this.getters); }, cb, options);
    };
    VueStoreImpl.prototype.hotUpdate = function (module) {
        this.gettersForComputed = {};
        this.innerStore.hotUpdate(module);
        this.setupStoreVM();
    };
    VueStoreImpl.prototype.transformGetter = function (desc, path) {
        var _this = this;
        if (typeof desc.get !== 'function')
            return desc;
        var name = path.join('.');
        this.gettersForComputed[name] = desc.get;
        desc.get = function () { return _this.vm[name]; };
        return desc;
    };
    VueStoreImpl.prototype.transformMutation = function (desc) {
        var _this = this;
        if (!this.strict)
            return desc;
        var original = desc.value;
        desc.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.commit(function () { return original.apply(null, args); });
        };
        return desc;
    };
    VueStoreImpl.prototype.setupStoreVM = function () {
        var oldVM = this.vm;
        this.vm = new _Vue({
            data: {
                state: this.innerStore.state
            },
            computed: this.gettersForComputed
        });
        // Ensure to re-evaluate getters for hot update
        if (oldVM != null) {
            this.commit(function () {
                oldVM.$data.state = null;
            });
            _Vue.nextTick(function () {
                oldVM.$destroy();
            });
        }
    };
    VueStoreImpl.prototype.commit = function (fn) {
        var original = this.strict;
        this.strict = false;
        fn();
        this.strict = original;
    };
    return VueStoreImpl;
}());
function store(module, options) {
    if (options === void 0) { options = {}; }
    return new VueStoreImpl(module, options);
}
function install(InjectedVue) {
    if (process.env.NODE_ENV !== 'production') {
        assert(!_Vue, 'Sinai is already installed');
    }
    _Vue = InjectedVue;
    _Vue.mixin({
        beforeCreate: sinaiInit
    });
}
function sinaiInit() {
    var vm = this;
    var store = vm.$options.store;
    if (store) {
        vm.$store = store;
        return;
    }
    if (vm.$parent && vm.$parent.$store) {
        vm.$store = vm.$parent.$store;
    }
}

exports.module = module$1;
exports.inject = inject;
exports.Getters = Getters;
exports.Mutations = Mutations;
exports.Actions = Actions;
exports.convertVuexPlugin = convertVuexPlugin;
exports.store = store;
exports.install = install;
