import { useState, useEffect } from 'react'
import useStore from './useStore'
import useSetAtomState, { SetAtomValueFunc } from './useSetAtomState'

export default function useAtomState (atomKey: any): [any, SetAtomValueFunc] {
  const store = useStore()
  const [, setCounter] = useState(0)
  const setAtomValue: SetAtomValueFunc = useSetAtomState(atomKey)

  useEffect(() => {
    const subscriber = () => {
      // force the component to re-render
      setCounter(count => count + 1)
    }
    return store.subscribeAtom(atomKey, subscriber)
  }, [store, atomKey])

  const atomValue = store.getAtomValue(atomKey)

  return [atomValue, setAtomValue]
}
