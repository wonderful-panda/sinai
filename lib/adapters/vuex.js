import { BG } from '../core/base';
import { isPromise } from '../utils';
/**
 * Convert Vuex plugin to Sinai plugin
 */
export function convertVuexPlugin(plugin) {
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
export function flattenGetters(getters, sep) {
    function loop(acc, path, getters) {
        Object.keys(getters).forEach(function (key) {
            if (key === '__proxy__' || key === 'modules') {
                return;
            }
            var desc = Object.getOwnPropertyDescriptor(getters, key);
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
