import { Plugin } from '../vue';
import { BG0, BA0, BM0 } from '../core/base';
import { Dictionary } from '../utils';
/**
 * Convert Vuex plugin to Sinai plugin
 */
export declare function convertVuexPlugin<S, G extends BG0, M extends BM0, A extends BA0>(plugin: (store: any) => void): Plugin<S, G, M, A>;
export declare function flattenGetters(getters: BG0, sep: string): Dictionary<any>;
