import { ModuleProxy } from './module';
import { assert, identity, bind, forEachValues } from '../utils';
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
export { StoreImpl };
function chainTransformer(path, transform) {
    return function chainedTransformer(desc, name) {
        return transform(desc, path.concat(name));
    };
}
