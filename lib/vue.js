import { StoreImpl } from './core/store';
import { devtoolPlugin } from './adapters/devtool-plugin';
import { assert, bind } from './utils';
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
export { VueStoreImpl };
export function store(module, options) {
    if (options === void 0) { options = {}; }
    return new VueStoreImpl(module, options);
}
export function install(InjectedVue) {
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
