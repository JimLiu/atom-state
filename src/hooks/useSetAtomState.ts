import { useCallback } from 'react'
import useStore from './useStore'

export type SetAtomValueFunc = (
  newValue: ((currentValue: any) => any) | any
) => void

export default function useSetAtomState (atomKey: any): SetAtomValueFunc {
  const store = useStore()
  const setAtomValue: SetAtomValueFunc = useCallback(
    newValue => {
      let newVal
      if (typeof newValue === 'function') {
        // get the current value, and pass it to the set function
        newVal = newValue(store.getAtomValue(atomKey))
      } else {
        newVal = newValue
      }
      store.setAtomValue(atomKey, newVal)
    },
    [store, atomKey]
  )

  return setAtomValue
}
