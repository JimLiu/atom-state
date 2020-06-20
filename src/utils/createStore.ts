import AtomStore, { AtomValueOption } from '../core/AtomStore'

export type DefaultAtomType = {
  key: any
  default: any
  option?: AtomValueOption
}

export default function createStore (): AtomStore
export default function createStore (defaultAtoms: Map<any, any>): AtomStore
export default function createStore (
  defaultAtoms: Array<DefaultAtomType>
): AtomStore
export default function createStore (defaultAtoms: Object): AtomStore

export default function createStore (
  defaultAtoms?: Map<any, any> | Array<DefaultAtomType> | Object
): AtomStore {
  let atoms: any
  if (defaultAtoms instanceof Map) {
    atoms = defaultAtoms
  } else {
    atoms = new Map()
  }

  const store = new AtomStore(atoms)
  if (Array.isArray(defaultAtoms)) {
    if (
      defaultAtoms.length &&
      defaultAtoms[0].hasOwnProperty('key') &&
      defaultAtoms[0].hasOwnProperty('default')
    ) {
      defaultAtoms.forEach(atom => {
        store.setAtomValue(atom.key, atom.default, atom.option)
      })
    }
  } else if (typeof defaultAtoms === 'object') {
    const keys: Array<any> = [
      ...Object.keys(defaultAtoms),
      ...Object.getOwnPropertySymbols(defaultAtoms)
    ]

    keys.forEach(key => {
      store.setAtomValue(key, defaultAtoms[key])
    })
  }

  return store
}
