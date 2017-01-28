import {
  Class, Dictionary,
  CHD, BG0, BM0, BA0
} from './interface'

import {
  BaseClass,
  BaseGettersImpl,
  BaseMutationsImpl,
  BaseActionsImpl
} from './base'

import { StoreImpl } from './store'
import { assert, getByPath } from './utils'

export interface ModuleOptions<S, G, M, A> {
  state?: Class<S>
  getters?: Class<G>
  mutations?: Class<M>
  actions?: Class<A>
}

export interface Module<S, G, M, A> {
  module<K extends string, S1, G1, M1, A1> (
    key: K,
    module: Module<S1, G1, M1, A1>
  ): Module<S & CHD<K, S1>, G & CHD<K, G1>, M & CHD<K, M1>, A & CHD<K, A1>>
}

export interface ModuleProxy<S, G, M, A> {
  readonly state: S
  readonly getters: G
  readonly mutations: M
  readonly actions: A
}

export class ModuleImpl implements Module<{}, BG0, BM0, BA0> {
  children: Dictionary<ModuleImpl> = {}
  State: Class<{}> | undefined
  Getters: BaseClass<BaseGettersImpl> | undefined
  Mutations: BaseClass<BaseMutationsImpl> | undefined
  Actions: BaseClass<BaseActionsImpl> | undefined

  constructor (
    public uid: number,
    { state, getters, mutations, actions }: ModuleOptions<{}, BG0, BM0, BA0>
  ) {
    this.State = state
    this.Getters = getters as BaseClass<BaseGettersImpl>
    this.Mutations = mutations as BaseClass<BaseMutationsImpl>
    this.Actions = actions as BaseClass<BaseActionsImpl>
  }

  initState (key: string, state: {}): void {
    state[key] = this.State ? new this.State() : {}
  }

  initGetters (key: string, getters: {}, store: StoreImpl): void {
    getters[key] = this.Getters ? new this.Getters(this, store) : {}
  }

  initMutations (key: string, mutations: {}, store: StoreImpl): void {
    mutations[key] = this.Mutations ? new this.Mutations(this, store) : {}
  }

  initActions (key: string, actions: {}, store: StoreImpl): void {
    actions[key] = this.Actions ? new this.Actions(this, store) : {}
  }

  module (key: string, module: ModuleImpl): ModuleImpl {
    assert(!(key in this.children), `${key} is already used in the module`)
    this.children[key] = module
    return this
  }
}

export class ModuleProxyImpl implements ModuleProxy<{}, {}, {}, {}> {
  constructor (
    private path: string[],
    private store: StoreImpl
  ) {}

  get state () {
    return getByPath(this.path, this.store.state)
  }

  get getters () {
    return getByPath(this.path, this.store.getters)
  }

  get mutations () {
    return getByPath(this.path, this.store.mutations)
  }

  get actions () {
    return getByPath(this.path, this.store.actions)
  }
}

let uid = 0

export function create<S extends {}, G extends BG0, M extends BM0, A extends BA0> (
  options: ModuleOptions<S, G, M, A> = {}
): Module<S, G, M, A> {
  return new ModuleImpl(++uid, options)
}