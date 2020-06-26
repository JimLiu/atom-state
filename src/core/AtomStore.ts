import Batcher from './Batcher'

export type AtomStoreListener = (newValue: any, key: any) => void

export type AtomPromiseFallbackType =
  | ((status: string, error?: Error) => any)
  | any

export type AtomValueOption = {
  fallback?: AtomPromiseFallbackType
  isAsync?: boolean
}

export type AtomPromiseStatus = 'loading' | 'success' | 'failed'

export type AtomPromiseType = {
  status: AtomPromiseStatus
  promise: Promise<any>
  contents: any
  error?: Error
}

export type GetDefaultValueType = (...params: any[]) => any

export type GetAtomValueOptionType = (...params: any) => AtomValueOption

export interface IAtomStore {
  subscribeAtom: (key: any, listener: AtomStoreListener) => () => void
  containsAtom: (key: any) => boolean
  isAtomPromise: (key: any) => boolean
  getAtomValue: (key: any) => any
  getAtomPromise: (key: any) => Promise<any>
  setAtomValue: (key: any, newValue: any, option?: AtomValueOption) => void
  removeAtom: (key: any) => boolean
  registerAtomGroup: (
    getKey: (...params: any[]) => any,
    getDefaultValue: GetDefaultValueType | any,
    getOption?: AtomValueOption | GetAtomValueOptionType
  ) => (...params: any[]) => void
}

export default class AtomStore implements IAtomStore {
  // all the subscriptions for atoms change
  _subscriptionsForAtoms: Map<any, Set<AtomStoreListener>>

  // a batch helper to merge notifications
  _batcher: Batcher

  // all the atoms
  _atomValues: Map<any, any>

  // save the promises and statuses
  _atomPromises: Map<any, AtomPromiseType>

  constructor (defaultAtoms: Map<any, any> = new Map()) {
    this._subscriptionsForAtoms = new Map()
    this._batcher = new Batcher(this._notifyAtomsChange.bind(this))
    this._atomValues = new Map(defaultAtoms)
    this._atomPromises = new Map()
  }

  /**
   * get all the liseners for an atom key
   * @param key - Atom key
   */
  _getAtomSubscriptions (key: any): Set<AtomStoreListener> {
    let subscribers = this._subscriptionsForAtoms.get(key)
    if (subscribers === undefined) {
      subscribers = new Set()
      this._subscriptionsForAtoms.set(key, subscribers)
    }
    return subscribers
  }

  /**
   * subscribe an atom changes with a lisener
   * @param key - Atom key
   * @param listener - the lisener function to receive the atom changes
   */
  subscribeAtom (key: any, listener: AtomStoreListener): () => void {
    const subscribers = this._getAtomSubscriptions(key)
    subscribers.add(listener)

    return () => subscribers.delete(listener)
  }

  /**
   * Check if the key exists
   * @param key - Atom key
   */
  containsAtom (key: any): boolean {
    return this._atomValues.has(key)
  }

  /**
   * Check if the atom contains a promise
   * @param key - Atom key
   */
  isAtomPromise (key: any): boolean {
    return this._atomPromises.has(key)
  }

  /**
   * Get the atom value by key
   * @param key - Atom key
   */
  getAtomValue (key: any): any {
    return this._atomValues.get(key)
  }

  /**
   * Get a Promise for the atom value
   * @param key - Atom key
   */
  getAtomPromise (key: any): Promise<any> {
    const content = this.getAtomValue(key)
    const atomPromise = this._atomPromises.get(key)
    if (!atomPromise) {
      return Promise.resolve()
    }

    // The atom value is NOT a promise or has already gotten the result
    // return the content with a Promise
    if (!this.isAtomPromise(key) || atomPromise.status === 'success') {
      return Promise.resolve(content)
    }

    if (atomPromise.status === 'failed') {
      return Promise.reject(atomPromise.error)
    }

    return Promise.resolve(atomPromise.promise)
  }

  /**
   * Get the fallback value for a promise
   * @param fallback - fallback value for loading or error status
   * could be a value or a function which accept a status param
   * @param status - the Promise status: loading, success, failed
   */
  _getFallbackValue (
    fallback: AtomPromiseFallbackType,
    status: AtomPromiseStatus,
    error?: Error
  ): any {
    if (typeof fallback === 'function') {
      return fallback(status, error)
    }

    return fallback
  }

  /**
   * _setAtomPromise
   * @param key - Atom key
   * @param promise - The atom value, should be a Promise
   * @param fallback - fallback value for loading status or error status
   *    fallback could be a value or a function which return a value base on status
   */
  _setAtomPromise (key: any, promise: Promise<any>, option?: AtomValueOption) {
    const atomPromise: AtomPromiseType = {
      status: 'loading',
      promise,
      contents: null,
      error: undefined
    }

    const setAtomValueAndPromise = (
      value: any,
      promiseValue: AtomPromiseType
    ) => {
      this._atomValues.set(key, value)
      this._atomPromises.set(key, promiseValue)
      this._batcher.notifyChange(key)
    }

    // set the content as a fallback value
    setAtomValueAndPromise(
      this._getFallbackValue(option?.fallback, 'loading'),
      atomPromise
    )

    const updateAtomPromise = (
      status: AtomPromiseStatus,
      newAtomValue: any,
      error?: Error
    ) => {
      // make sure the promise exists and didn't change
      if (this._atomPromises.get(key) === atomPromise) {
        atomPromise.status = status
        atomPromise.error = error
        // update atom value and notice change
        setAtomValueAndPromise(newAtomValue, atomPromise)
      }
    }

    promise
      .then(result => {
        updateAtomPromise('success', result)
      })
      .catch(error => {
        const newAtomValue = this._getFallbackValue(
          option?.fallback,
          'failed',
          error
        )
        updateAtomPromise('failed', newAtomValue, error)
      })
  }

  /**
   * Update an atom value
   * @param key - Atom key
   * @param newValue - The new atom value
   */
  setAtomValue (key: any, newValue: any, option?: AtomValueOption) {
    // is async
    if (
      (newValue instanceof Promise && option?.isAsync !== false) || // Promise is async by default, unless it's marked as not async
      option?.isAsync // or it's marked as async
    ) {
      this._setAtomPromise(key, Promise.resolve(newValue), option)
      return
    }

    // delete the old promise if the new value is not an async
    if (this.isAtomPromise(key)) {
      this._atomPromises.delete(key)
    }

    this._atomValues.set(key, newValue)
    this._batcher.notifyChange(key)
  }

  /**
   * Batch notification to the atom liseners
   * @param keys - The atom keys which changed value
   */
  _notifyAtomsChange (keys: Array<any>): void {
    keys.forEach((key: any) => {
      const listeners = this._getAtomSubscriptions(key)
      const newValue = this.getAtomValue(key)
      listeners.forEach(listener => listener(newValue, key))
    })
  }

  /**
   * Remove an atom from the store
   * @param key - Atom key
   */
  removeAtom (key: any): boolean {
    const result = this._atomValues.has(key)

    this._atomPromises.delete(key)
    this._atomValues.delete(key)
    this._subscriptionsForAtoms.delete(key)

    return result
  }

  registerAtomGroup (
    getKey: (...params: any[]) => any,
    getDefaultValue: GetDefaultValueType | any,
    getOption?: AtomValueOption | GetAtomValueOptionType
  ): (...params: any[]) => void {
    const get = this.getAtomValue.bind(this)

    return (...params: any[]) => {
      const key = getKey(...params)
      let value
      if (typeof getDefaultValue === 'function') {
        value = getDefaultValue(...params)
      } else {
        value = getDefaultValue
      }

      // getDefaultValue might be (...parms) => ({ get }) => any
      if (typeof value === 'function') {
        value = value({ get })
      }

      let option
      if (typeof getOption === 'function') {
        option = getOption(...params)
      } else {
        option = getOption
      }

      if (!this.containsAtom(key)) {
        this.setAtomValue(key, value, option)
      }
      return key
    }
  }
}
