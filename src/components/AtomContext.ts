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
  subscribeAtom = () => {
    notInAContext()
    return () => {}
  }
  containsAtom = notInAContextWithReturn
  isAtomPromise = notInAContextWithReturn
  getAtomValue = notInAContextWithReturn
  getAtomPromise = () => {
    notInAContext()
    return Promise.resolve()
  }
  setAtomValue = notInAContext
  removeAtom = notInAContextWithReturn
  registerAtomGroup = () => {
    notInAContext()
    return () => {}
  }
}

const defaultStore = new DefaultAtomStore()

const AtomContext = createContext<IAtomStore>(defaultStore)

export default AtomContext
