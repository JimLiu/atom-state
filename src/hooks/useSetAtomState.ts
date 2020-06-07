import useAtomState, { SetAtomValueFunc } from './useAtomState'

export default function useSetAtomState (atomKey: any): SetAtomValueFunc {
  const [, setAtomValue] = useAtomState(atomKey)

  return setAtomValue
}
