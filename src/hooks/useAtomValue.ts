import useAtomState from './useAtomState'

export default function useAtomValue (atomKey: any): any {
  const [value] = useAtomState(atomKey)

  return value
}
