import { useContext } from 'react'
import AtomContext from '../components/AtomContext'
import { IAtomStore } from '../core/AtomStore'

export default function useStore (): IAtomStore {
  return useContext(AtomContext)
}
