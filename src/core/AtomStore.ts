import Batcher from './Batcher'

export type AtomStoreListener = (newValue: any, key: any) => void

export interface IAtomStore {
  getAtomValue: (key: any) => any
  setAtomValue: (key: any, newValue: any) => void
  subscribe: (key: any, listener: AtomStoreListener) => void
  unsubscribe: (key: any, listener: AtomStoreListener) => void
}
export function createStore (defaultAtoms?: Map<any, any>): AtomStore {
  return new AtomStore(defaultAtoms)
}

export default class AtomStore implements IAtomStore {
  componentSubscriptions: Map<any, Array<AtomStoreListener>>
  batcher: Batcher
  atomValues: Map<any, any>

  constructor (defaultAtoms: Map<any, any> = new Map()) {
    this.componentSubscriptions = new Map()
    this.batcher = new Batcher(this.notifyChanges.bind(this))
    this.atomValues = new Map(defaultAtoms)
  }

  getSubscriptions (key: any): Array<AtomStoreListener> {
    let subscribers = this.componentSubscriptions.get(key)
    if (subscribers === undefined) {
      subscribers = []
      this.componentSubscriptions.set(key, subscribers)
    }
    return subscribers
  }

  subscribe (key: any, listener: AtomStoreListener) {
    const subscribers = this.getSubscriptions(key)
    subscribers.push(listener)
  }

  unsubscribe (key: any, listener: AtomStoreListener) {
    const subscribers = this.getSubscriptions(key)
    var index = subscribers.indexOf(listener)
    if (index > -1) {
      subscribers.splice(index, 1)
    }
  }

  getAtomValue (key: any): any {
    return this.atomValues.get(key)
  }

  setAtomValue (key: any, newValue: any) {
    if (!this.atomValues.has(key)) {
      return // won't set an atom value if the key does not exist
    }
    this.atomValues.set(key, newValue)
    this.batcher.notifyChange(key)
  }

  notifyChanges (keys: Array<any>): void {
    keys.forEach((key: any) => {
      const listeners = this.getSubscriptions(key)
      const newValue = this.getAtomValue(key)
      listeners.forEach(listener => listener(newValue, key))
    })
  }
}
