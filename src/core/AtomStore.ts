import Batcher from './Batcher'

export type AtomStoreListener = (newValue: any, key: any) => void

export type AsyncAtomFallbackType = ((status: string) => any) | any

export type AsyncAtomType = {
  status: 'loading' | 'success' | 'failed'
  promise: Promise<any>
  contents: any
  fallback?: AsyncAtomFallbackType
  error?: Error
}

export interface IAtomStore {
  subscribeAtom: (key: any, listener: AtomStoreListener) => void
  unsubscribeAtom: (key: any, listener: AtomStoreListener) => boolean
  containsAtom(key: any): boolean
  isAsyncAtom(key: any): boolean
  getAtomValue: (key: any) => any
  setAtomValue: (key: any, newValue: any) => boolean
  registerAtom(key: any, defaultValue: any): boolean
  registerAsyncAtom(
    key: any,
    defaultValue: Promise<any>,
    fallback?: AsyncAtomFallbackType
  ): boolean
  removeAtom(key: any): boolean
}

export default class AtomStore implements IAtomStore {
  // all the subscriptions for atoms change
  subscriptionsForAtoms: Map<any, Array<AtomStoreListener>>

  // a batch helper to merge notifications
  batcher: Batcher

  // all the atoms
  atomValues: Map<any, any>

  // indentify the async atoms by storing their keys to asyncAtomKeys
  asyncAtomKeys: Set<any>

  constructor (defaultAtoms: Map<any, any> = new Map()) {
    this.subscriptionsForAtoms = new Map()
    this.batcher = new Batcher(this.notifyAtomsChange.bind(this))
    this.atomValues = new Map(defaultAtoms)
    this.asyncAtomKeys = new Set()
  }

  /**
   * get all the liseners for an atom key
   * @param key - Atom key
   */
  getAtomSubscriptions (key: any): Array<AtomStoreListener> {
    let subscribers = this.subscriptionsForAtoms.get(key)
    if (subscribers === undefined) {
      subscribers = []
      this.subscriptionsForAtoms.set(key, subscribers)
    }
    return subscribers
  }

  /**
   * subscribe an atom changes with a lisener
   * @param key - Atom key
   * @param listener - the lisener function to receive the atom changes
   */
  subscribeAtom (key: any, listener: AtomStoreListener) {
    const subscribers = this.getAtomSubscriptions(key)
    subscribers.push(listener)
  }

  /**
   * unsubscribe a lisener for atom changes
   * @param key - Atom key
   * @param listener - the lisener function you want to unsubscribe
   */
  unsubscribeAtom (key: any, listener: AtomStoreListener): boolean {
    const subscribers = this.getAtomSubscriptions(key)
    var index = subscribers.indexOf(listener)
    if (index > -1) {
      subscribers.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Check if the key exists
   * @param key - Atom key
   */
  containsAtom (key: any): boolean {
    return this.atomValues.has(key)
  }

  /**
   * Check if the atom is async
   * @param key - Atom key
   */
  isAsyncAtom (key: any): boolean {
    return this.asyncAtomKeys.has(key)
  }

  /**
   * Get the atom value by key
   * @param key - Atom key
   */
  getAtomValue (key: any): any {
    const atomValue = this.atomValues.get(key)

    // return result directly if it's not async atom
    if (!this.isAsyncAtom(key)) {
      return atomValue
    }

    const { status, contents, fallback } = atomValue

    if (status === 'success') {
      return contents
    }

    if (typeof fallback === 'function') {
      return fallback(status) // return different result by status
    }

    return fallback
  }

  /**
   * Update an atom value
   * @param key - Atom key
   * @param newValue - The new atom value
   */
  setAtomValue (key: any, newValue: any): boolean {
    // won't set an atom value if the key does not exist or it's async
    if (!this.atomValues.has(key) || this.isAsyncAtom(key)) {
      return false
    }
    this.atomValues.set(key, newValue)
    this.batcher.notifyChange(key)
    return true
  }

  /**
   * Batch notification to the atom liseners
   * @param keys - The atom keys which changed value
   */
  notifyAtomsChange (keys: Array<any>): void {
    keys.forEach((key: any) => {
      const listeners = this.getAtomSubscriptions(key)
      const newValue = this.getAtomValue(key)
      listeners.forEach(listener => listener(newValue, key))
    })
  }

  /**
   * register an atom by key and value
   * @param key - Atom key
   * @param defaultValue - default value
   * @returns
   *    true: registered the atom
   *    false: the key has existed
   */
  registerAtom (key: any, defaultValue: any): boolean {
    if (this.atomValues.has(key)) {
      return false
    }

    this.atomValues.set(key, defaultValue)

    return false
  }

  registerAsyncAtom (
    key: any,
    defaultValue: Promise<any> | any,
    fallback?: AsyncAtomFallbackType
  ): boolean {
    if (this.atomValues.has(key)) {
      return false
    }

    // make sure the default value is a Promise
    let promise = Promise.resolve(defaultValue)

    let atomValue: AsyncAtomType = {
      status: 'loading',
      promise,
      contents: null,
      fallback
    }

    // add the key to `asyncAtomKeys`
    this.asyncAtomKeys.add(key)

    // set atom value
    this.atomValues.set(key, atomValue)

    const updateAtomValue = (atomValue: AsyncAtomType) => {
      if (this.atomValues.has(key)) {
        // might be removed
        this.atomValues.set(key, atomValue)
        this.batcher.notifyChange(key)
      }
    }

    promise
      .then(result => {
        atomValue = {
          status: 'success', // set status to `success`
          promise,
          contents: result, // set contents to the result of promise
          fallback
        }
        updateAtomValue(atomValue)
      })
      .catch(error => {
        atomValue = {
          status: 'failed',
          promise,
          contents: null,
          fallback,
          error
        }
        updateAtomValue(atomValue)

        throw error
      })

    return false
  }

  /**
   * Remove an atom from the store
   * @param key - Atom key
   */
  removeAtom (key: any): boolean {
    if (!this.atomValues.has(key)) {
      return false
    }

    this.asyncAtomKeys.delete(key)
    this.atomValues.delete(key)
    this.subscriptionsForAtoms.delete(key)

    return true
  }
}
