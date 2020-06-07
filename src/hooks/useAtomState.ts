import { useState, useEffect } from 'react'
import useStore from './useStore'
import useSetAtomState, { SetAtomValueFunc } from './useSetAtomState'

export default function useAtomState (atomKey: any): [any, SetAtomValueFunc] {
  const store = useStore()
  const [, setCounter] = useState(0)
  const setAtomValue: SetAtomValueFunc = useSetAtomState(atomKey)

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
