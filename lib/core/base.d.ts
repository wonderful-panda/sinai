import { Class, CHD } from '../utils';
import { Module, ModuleImpl, ModuleProxy } from './module';
import { StoreImpl } from './store';
export interface GI<S, G extends BG0> {
    readonly state: S;
    readonly getters: G;
}
export interface AI<S, G extends BG0, M extends BM0, A extends BA0> {
    readonly state: S;
    readonly getters: G;
    readonly mutations: M;
    readonly actions: A;
}
export interface GI0 extends GI<{}, BG0> {
}
export interface AI0 extends AI<{}, BG0, BM0, BA0> {
}
export interface Injected<SG, SGMA> {
    Getters<S>(): Class<BG<S, SG>>;
    Mutations<S>(): Class<BM<S>>;
    Actions<G extends BG0>(): Class<BA<{}, G, BM0, SGMA>>;
    Actions<M extends BM0>(): Class<BA<{}, BG0, M, SGMA>>;
    Actions<S>(): Class<BA<S, BG0, BM0, SGMA>>;
    Actions<S, G extends BG0>(): Class<BA<S, G, BM0, SGMA>>;
    Actions<S, M extends BM0>(): Class<BA<S, BG0, M, SGMA>>;
    Actions<S, G extends BG0, M extends BM0>(): Class<BA<S, G, M, SGMA>>;
    and<K extends string, S, G extends BG0, M extends BM0, A extends BA0>(key: K, module: Module<S, G, M, A>): Injected<SG & CHD<K, GI<S, G>>, SGMA & CHD<K, AI<S, G, M, A>>>;
}
export declare function makeInjected(Getters: BaseClass<BG0>, Mutations: BaseClass<BM0>, Actions: BaseClass<BA0>): Injected<{}, {}>;
export interface BaseClass<T> {
    new (module: ModuleImpl, store: StoreImpl): T;
}
export declare class Base {
    protected __proxy__: ModuleProxy;
    constructor(module: ModuleImpl, store: StoreImpl);
}
export declare class BaseInjectable<I> extends Base {
    protected modules: I;
}
export declare class BG<S, SG> extends BaseInjectable<SG> {
    protected readonly state: S;
}
export declare class BM<S> extends Base {
    protected readonly state: S;
}
export declare class BA<S, G extends BG0, M extends BM0, SGMA> extends BaseInjectable<SGMA> {
    protected readonly state: S;
    protected readonly getters: G;
    protected readonly mutations: M;
}
export interface BG0 extends BG<{}, {}> {
}
export interface BG1<S> extends BG<S, {}> {
}
export interface BM0 extends BM<{}> {
}
export interface BA0 extends BA<{}, BG0, BM0, {}> {
}
export interface BA1<S, G extends BG0, M extends BM0> extends BA<S, G, M, {}> {
}
export declare function Getters<S>(): Class<BG1<S>>;
export declare function Mutations<S>(): Class<BM<S>>;
export declare function Actions<G extends BG0>(): Class<BA1<{}, G, BM0>>;
export declare function Actions<M extends BM0>(): Class<BA1<{}, BG0, M>>;
export declare function Actions<S>(): Class<BA1<S, BG0, BM0>>;
export declare function Actions<S, G extends BG0>(): Class<BA1<S, G, BM<S>>>;
export declare function Actions<S, M extends BM0>(): Class<BA1<S, BG1<S>, M>>;
export declare function Actions<S, G extends BG0, M extends BM0>(): Class<BA1<S, G, M>>;
export declare function inject<K extends string, S, G extends BG0, M extends BM0, A extends BA0>(key: K, module: Module<S, G, M, A>): Injected<CHD<K, GI<S, G>>, CHD<K, AI<S, G, M, A>>>;
