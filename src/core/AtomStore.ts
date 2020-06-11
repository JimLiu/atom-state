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

export interface IAtomStore {
  subscribeAtom: (key: any, listener: AtomStoreListener) => void
  unsubscribeAtom: (key: any, listener: AtomStoreListener) => boolean
  containsAtom(key: any): boolean
  isAtomPromise(key: any): boolean
  getAtomValue: (key: any) => any
  getAtomPromise(key: any): Promise<any> | undefined
  setAtomValue: (key: any, newValue: any, option?: AtomValueOption) => boolean
  removeAtom(key: any): boolean
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
  subscribeAtom (key: any, listener: AtomStoreListener) {
    const subscribers = this._getAtomSubscriptions(key)
    subscribers.add(listener)
  }

  /**
   * unsubscribe a lisener for atom changes
   * @param key - Atom key
   * @param listener - the lisener function you want to unsubscribe
   */
  unsubscribeAtom (key: any, listener: AtomStoreListener): boolean {
    const subscribers = this._getAtomSubscriptions(key)
    if (!subscribers.has(listener)) {
      return false
    }

    subscribers.delete(listener)
    return false
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
  getAtomPromise (key: any): Promise<any> | undefined {
    const content: any = this.getAtomValue(key)
    const atomPromise = this._atomPromises.get(key)

    // The atom value is NOT a promise or has already gotten the result
    // return the content with a Promise
    if (
      (!this.isAtomPromise(key) && this.containsAtom(key)) ||
      atomPromise?.status === 'success'
    ) {
      return Promise.resolve(content)
    }

    if (atomPromise?.status === 'failed') {
      return Promise.reject(atomPromise?.error)
    }

    return atomPromise?.promise
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
  _setAtomPromise (
    key: any,
    promise: Promise<any>,
    fallback: AtomPromiseFallbackType
  ) {
    const atomPromise: AtomPromiseType = {
      status: 'loading',
      promise,
      contents: null,
      error: undefined
    }

    // set the content as a fallback value
    this._atomValues.set(key, this._getFallbackValue(fallback, 'loading'))
    this._atomPromises.set(key, atomPromise)

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
        this.setAtomValue(key, newAtomValue)
        this._atomPromises.set(key, atomPromise)
      }
    }

    promise
      .then(result => {
        updateAtomPromise('success', result)
      })
      .catch(error => {
        const newAtomValue = this._getFallbackValue(fallback, 'failed', error)
        updateAtomPromise('failed', newAtomValue, error)
      })
  }

  /**
   * Update an atom value
   * @param key - Atom key
   * @param newValue - The new atom value
   */
  setAtomValue (key: any, newValue: any, option?: AtomValueOption): boolean {
    // is async
    if (
      (newValue instanceof Promise && option?.isAsync !== false) || // Promise is async by default, unless it's marked as not async
      option?.isAsync // or it's marked as async
    ) {
      this._setAtomPromise(key, Promise.resolve(newValue), option?.fallback)
      return true
    }

    // delete the old promise if the new value is not an async
    if (this.isAtomPromise(key)) {
      this._atomPromises.delete(key)
    }

    this._atomValues.set(key, newValue)
    this._batcher.notifyChange(key)
    return true
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
}
