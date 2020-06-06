import { createContext } from 'react'
import { IAtomStore } from '../core/AtomStore'

function notInAContext () {
  throw new Error(
    'This component must be used inside a <AtomRoot> component with a valid `store` property.'
  )
}

export class DefaultAtomStore implements IAtomStore {
  getAtomValue () {
    return notInAContext()
  }

  setAtomValue () {
    notInAContext()
  }

  subscribeAtom () {
    notInAContext()
  }

  unsubscribeAtom () {
    notInAContext()
  }
}

const defaultStore = new DefaultAtomStore()

const AtomContext = createContext<IAtomStore>(defaultStore)

export default AtomContext
