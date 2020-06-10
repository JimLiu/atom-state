import { createContext } from 'react'
import { IAtomStore } from '../core/AtomStore'

function notInAContext () {
  throw new Error(
    'This component must be used inside a <AtomRoot> component with a valid `store` property.'
  )
}

function notInAContextWithReturn () {
  notInAContext()
  return false
}

export class DefaultAtomStore implements IAtomStore {
  subscribeAtom = notInAContext
  unsubscribeAtom = notInAContextWithReturn
  containsAtom = notInAContextWithReturn
  isAtomPromise = notInAContextWithReturn
  getAtomValue = notInAContextWithReturn
  getAtomPromise = () => {
    notInAContext()
    return undefined
  }
  setAtomValue = notInAContextWithReturn
  removeAtom = notInAContextWithReturn
}

const defaultStore = new DefaultAtomStore()

const AtomContext = createContext<IAtomStore>(defaultStore)

export default AtomContext
