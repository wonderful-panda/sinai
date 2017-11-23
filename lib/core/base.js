import * as tslib_1 from "tslib";
import { assert } from '../utils';
export function makeInjected(Getters, Mutations, Actions) {
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
        tslib_1.__extends(class_1, _super);
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
export { Base };
var BaseInjectable = /** @class */ (function (_super) {
    tslib_1.__extends(BaseInjectable, _super);
    function BaseInjectable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modules = {};
        return _this;
    }
    return BaseInjectable;
}(Base));
export { BaseInjectable };
var BG = /** @class */ (function (_super) {
    tslib_1.__extends(BG, _super);
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
export { BG };
var BM = /** @class */ (function (_super) {
    tslib_1.__extends(BM, _super);
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
export { BM };
var BA = /** @class */ (function (_super) {
    tslib_1.__extends(BA, _super);
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
export { BA };
export function Getters() {
    return BG;
}
export function Mutations() {
    return BM;
}
export function Actions() {
    return BA;
}
export function inject(key, module) {
    return makeInjected(BG, BM, BA).and(key, module);
}
