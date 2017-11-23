import { BG0, BM0, BA0 } from './base';
import { Module, ModuleImpl, ModuleProxy } from './module';
export declare type Transformer = (desc: PropertyDescriptor, path: string[]) => PropertyDescriptor;
export interface StoreOptions {
    transformGetter?: Transformer;
    transformMutation?: Transformer;
    transformAction?: Transformer;
}
export declare type Subscriber<S> = (mutationPath: string[], payload: any[], state: S) => void;
export interface Store<S, G extends BG0, M extends BM0, A extends BA0> {
    readonly state: S;
    readonly getters: G;
    readonly mutations: M;
    readonly actions: A;
    replaceState(state: S): void;
    subscribe(fn: Subscriber<S>): () => void;
    hotUpdate(module: Module<S, G, M, A>): void;
}
export declare class StoreImpl implements Store<{}, BG0, BM0, BA0> {
    private moduleMap;
    private subscribers;
    private transformGetter;
    private transformMutation;
    private transformAction;
    state: {};
    getters: BG0;
    mutations: BM0;
    actions: BA0;
    constructor(module: ModuleImpl, options?: StoreOptions);
    replaceState(state: {}): void;
    subscribe(fn: Subscriber<{}>): () => void;
    registerModule(module: ModuleImpl, isHot: boolean): void;
    getProxy(module: ModuleImpl): ModuleProxy | null;
    hotUpdate(module: ModuleImpl): void;
    private registerModuleLoop(path, module);
    private initModuleAssets(path, module);
    private hookMutation(desc, path);
}
