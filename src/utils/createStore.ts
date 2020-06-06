import AtomStore from '../core/AtomStore';

export type DefaultAtomType = {
  key: any,
  default: any,
}

export default function createStore (): AtomStore;
export default function createStore (defaultAtoms: Map<any, any>): AtomStore;
export default function createStore (defaultAtoms: Array<DefaultAtomType>): AtomStore;
export default function createStore (defaultAtoms: Object): AtomStore;

export default function createStore (defaultAtoms?: Map<any, any> | Array<DefaultAtomType> | Object): AtomStore {
  let atoms: any;
  if (defaultAtoms instanceof Map) {
    atoms = defaultAtoms;
  } else if (Array.isArray(defaultAtoms) && defaultAtoms.length && defaultAtoms[0].key) {
    // Array with DefaultAtomType 
    atoms = defaultAtoms.reduce((acc, atom) => {
      if (atom && atom.key && atom.default) {
        acc.set(atom.key, atom.default);
      }
      return acc;
    }, new Map());
  } else if (typeof defaultAtoms === 'object') {
    // Convert a normal object to Map
    atoms = Object.keys(defaultAtoms).reduce((acc, key) => {
      acc.set(key, defaultAtoms[key]);
      return acc;
    }, new Map());
  } else {
    atoms = new Map(defaultAtoms);
  }

  return new AtomStore(atoms)
}
