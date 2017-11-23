import { flattenGetters } from './vuex';
var devtoolHook = typeof window !== 'undefined' &&
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/**
 * Mimic Vuex to use the vue-devtools feature
 */
export function devtoolPlugin(store) {
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
