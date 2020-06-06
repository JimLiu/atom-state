import Batcher from './Batcher'

export type AtomStoreListener = (newValue: any, key: any) => void

export interface IAtomStore {
  getAtomValue: (key: any) => any
  setAtomValue: (key: any, newValue: any) => void
  subscribeAtom: (key: any, listener: AtomStoreListener) => void
  unsubscribeAtom: (key: any, listener: AtomStoreListener) => void
}

export default class AtomStore implements IAtomStore {
  subscriptionsForAtoms: Map<any, Array<AtomStoreListener>>
  batcher: Batcher
  atomValues: Map<any, any>

  constructor (defaultAtoms: Map<any, any> = new Map()) {
    this.subscriptionsForAtoms = new Map()
    this.batcher = new Batcher(this.notifyAtomsChange.bind(this))
    this.atomValues = new Map(defaultAtoms)
  }

  getAtomSubscriptions (key: any): Array<AtomStoreListener> {
    let subscribers = this.subscriptionsForAtoms.get(key)
    if (subscribers === undefined) {
      subscribers = []
      this.subscriptionsForAtoms.set(key, subscribers)
    }
    return subscribers
  }

  subscribeAtom (key: any, listener: AtomStoreListener) {
    const subscribers = this.getAtomSubscriptions(key)
    subscribers.push(listener)
  }

  unsubscribeAtom (key: any, listener: AtomStoreListener) {
    const subscribers = this.getAtomSubscriptions(key)
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

  notifyAtomsChange (keys: Array<any>): void {
    keys.forEach((key: any) => {
      const listeners = this.getAtomSubscriptions(key)
      const newValue = this.getAtomValue(key)
      listeners.forEach(listener => listener(newValue, key))
    })
  }
}
