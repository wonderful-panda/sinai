import Vue, { WatchOptions } from 'vue';
import { BG0, BM0, BA0 } from './core/base';
import { Module, ModuleImpl } from './core/module';
import { Store, Subscriber } from './core/store';
export declare type Plugin<S, G extends BG0, M extends BM0, A extends BA0> = (store: VueStore<S, G, M, A>) => void;
export interface VueStoreOptions<S, G extends BG0, M extends BM0, A extends BA0> {
    strict?: boolean;
    plugins?: Plugin<S, G, M, A>[];
}
export interface VueStore<S, G extends BG0, M extends BM0, A extends BA0> extends Store<S, G, M, A> {
    watch<R>(getter: (state: S, getters: G) => R, cb: (newState: R, oldState: R) => void, options?: WatchOptions): () => void;
}
export declare class VueStoreImpl implements VueStore<{}, BG0, BM0, BA0> {
    private innerStore;
    private vm;
    private watcher;
    private gettersForComputed;
    private strict;
    constructor(module: ModuleImpl, options: VueStoreOptions<{}, BG0, BM0, BA0>);
    readonly state: {};
    readonly getters: BG0;
    readonly mutations: BM0;
    readonly actions: BA0;
    replaceState(state: {}): void;
    subscribe(fn: Subscriber<{}>): () => void;
    watch<R>(getter: (state: {}, getters: BG0) => R, cb: (newState: R, oldState: R) => void, options?: WatchOptions): () => void;
    hotUpdate(module: ModuleImpl): void;
    private transformGetter(desc, path);
    private transformMutation(desc);
    private setupStoreVM();
    private commit(fn);
}
export declare function store<S, G extends BG0, M extends BM0, A extends BA0>(module: Module<S, G, M, A>, options?: VueStoreOptions<S, G, M, A>): VueStore<S, G, M, A>;
export declare function install(InjectedVue: typeof Vue): void;
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        store?: VueStore<any, any, any, any>;
    }
}
