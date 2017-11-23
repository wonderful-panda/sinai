import { BaseClass, BM, BG0, BM0, BA0, BG1, BA1 } from './base';
import { StoreImpl } from './store';
import { Class, Dictionary, CHD } from '../utils';
export declare type Transformer = (desc: PropertyDescriptor, key: string) => PropertyDescriptor;
export interface ModuleOptions<S, G extends BG0, M extends BM0, A extends BA0> {
    state?: Class<S>;
    getters?: Class<G>;
    mutations?: Class<M>;
    actions?: Class<A>;
}
export interface Module<S, G extends BG0, M extends BM0, A extends BA0> {
    child<K extends string, S1, G1 extends BG0, M1 extends BM0, A1 extends BA0>(key: K, module: Module<S1, G1, M1, A1>): Module<S & CHD<K, S1>, G & CHD<K, G1>, M & CHD<K, M1>, A & CHD<K, A1>>;
}
export declare class ModuleImpl implements Module<{}, BG0, BM0, BA0> {
    uid: number;
    children: Dictionary<ModuleImpl>;
    State: Class<{}> | undefined;
    Getters: BaseClass<BG0> | undefined;
    Mutations: BaseClass<BM0> | undefined;
    Actions: BaseClass<BA0> | undefined;
    constructor(uid: number, {state, getters, mutations, actions}: ModuleOptions<{}, BG0, BM0, BA0>);
    initState(): {};
    initGetters(store: StoreImpl, transformer?: Transformer): BG0;
    initMutations(store: StoreImpl, transformer?: Transformer): BM0;
    initActions(store: StoreImpl, transformer?: Transformer): BA0;
    child(key: string, module: ModuleImpl): this;
}
export declare class ModuleProxy {
    private path;
    private store;
    constructor(path: string[], store: StoreImpl);
    readonly state: {};
    readonly getters: BG0;
    readonly mutations: BM0;
    readonly actions: BA0;
}
export declare function module<S, G extends BG1<S>, M extends BM<S>, A extends BA1<S, G, M>>(options?: ModuleOptions<S, G, M, A>): Module<S, G, M, A>;
