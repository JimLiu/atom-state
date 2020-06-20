---
title: createStore
hide_title: true
---

# `createStore(defaultAtoms?)`

Creates a `atom-state` store that holds the atoms of your app. There should only be a single store in your `AtomRoot` component tree.

#### Arguments

`defaultAtoms?` _(`Map<any, any> | Object | Array<DefaultAtomType>`)_: The initial atoms. The atoms is holded as a `Map<any, any>` in store, you can pass a defaultAtoms parameter to initialize it.

- `defaultAtoms?`: The `defaultAtoms` param could be null or undefined.
- `defaultAtoms: Map<any, any>`: The atoms is holded as a Map in store, so you can just pass a Map to initialize it.
- `defaultAtoms: Object`: The Object you passed will be converted to `Map<any, any>`.
- `defaultAtoms: Array<DefaultAtomType>`: The previous types of Map and Object can't pass options for Atom, you can pass an array with items of `DefaultAtomType`.
  - `DefaultAtomType.key: any`: The atom key.
  - `DefaultAtomType.default: any`: The default atom value.
  - `DefaultAtomType.option?: AtomValueOption`: The option for creating atom.

#### Returns

([Store](store)): An object that holds the complete atoms. You may also subscribe to the changes to the atoms to update the UI.

### Examples

#### Create store without defaultAtoms

```js
import { createStore } from 'atom-state';

const store = createStore();

export default store;
```

#### Create store with `defaultAtoms: Map<any, any>`

```js
import { createStore } from 'atom-state';

const defaultAtoms = new Map();
defaultAtoms.set('foo', 'bar');
defaultAtoms.set('count', 1);
defaultAtoms.set(1, 1);

const store = createStore(defaultAtoms);

export default store;
```

#### Create store with `defaultAtoms: Object`

```js
import { createStore } from 'atom-state';

const symbolKey = Symbol('This is a Symbol')

const store = createStore({
  'key': 'atom value',
  'count': 0,
  [symbolKey]: 'Value', // key could be a Symbol
  1: 'one', // key could be a number
  'repositories': fetchRepositories('react') // it's an async atom if value is a Promise
});

export default store;
export { symbolKey };
```

#### Create store with `defaultAtoms: Array<DefaultAtomType>`

```js
import { createStore } from 'atom-state';


// Fetch repositories by name
// returns a Promise
const fetchRepositories = (name) =>
  fetch(`//api.github.com/search/repositories?q=${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(json => json.items)

const defaultAtoms = [
  {
    key: 'foo',
    default: 'bar'
  },
  {
    key: 'count',
    default: 1
  },
  {
    key: 'react-repositories',
    default: fetchRepositories('react'),
    option: {
      fallback: 'loading'
    }
  }
]

const store = createStore(defaultAtoms);

export default store;
```
