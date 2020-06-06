import { useState, useEffect, useCallback } from 'react'
import useStore from './useStore'

type SetAtomValueFunc = (newValue: ((currentValue: any) => any) | any) => void

export default function useAtomState (atomKey: any): [any, SetAtomValueFunc] {
  const store = useStore()
  const [, setCounter] = useState(0)
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

  useEffect(() => {
    const subscriber = () => {
      setCounter(count => count + 1)
    }
    store.subscribeAtom(atomKey, subscriber)

    return () => {
      store.unsubscribeAtom(atomKey, subscriber)
    }
  }, [store, atomKey])

  const atomValue = store.getAtomValue(atomKey)

  return [atomValue, setAtomValue]
}
