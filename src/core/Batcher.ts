let resolvedPromise: Promise<any>

const enqueuePostPromiseJob =
  typeof process === 'object' && typeof process.nextTick === 'function'
    ? function (fn: () => void) {
        if (!resolvedPromise) {
          resolvedPromise = Promise.resolve()
        }
        resolvedPromise.then(() => {
          process.nextTick(fn)
        })
      }
    : setImmediate || setTimeout

export type NotifyChangesFunc = (keys: Array<any>) => void

export default class Batcher {
  keys: Set<any>
  private notifyChanges: NotifyChangesFunc

  constructor (notifyChanges: NotifyChangesFunc) {
    this.keys = new Set()
    this.notifyChanges = notifyChanges
  }

  notifyChange (key: any) {
    this.keys.add(key)
    // dispatch query in next run loop
    if (this.keys.size === 1) {
      enqueuePostPromiseJob(() => this.dispatchQueue())
    }
  }

  dispatchQueue () {
    const keys = this.keys
    this.keys = new Set()

    this.notifyChanges(Array.from(keys))
  }
}
