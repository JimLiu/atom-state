---
title: Getting Started
---

## Installation

To install `atom-state`, run the following command:

```shell
npm install atom-state
```

Or if you're using <a href="https://classic.yarnpkg.com/en/docs/install/" target="_blank">yarn</a>:

```shell
yarn add atom-state
```

## Store

Store is the container for all the atoms. We need to create a store for our atoms before we use `atom-state`.
```js
import { createStore } from "atom-state";

const store = createStore({
  count: 0
});
```

## AtomRoot

Components that uses `atom-state` need `AtomRoot` to appear somewhere in the parent tree.
The `AtomRoot` needs to be passed a `store` property with a valid store value.

```js
import { createStore } from "atom-state";

const store = createStore({
  count: 0
});
```

```jsx
import React from 'react';
import { AtomRoot } from 'atom-state';
import store from './store.js';

function App() {
  return (
    <RecoilRoot store={store}>
      <Counter />
    </RecoilRoot>
  );
}
```

## Atom
An atom represents a piece of state. Atoms can be read from and written to from any component. Components that read the value of an atom are implicitly subscribed to that atom, so any atom updates will result in a re-render of all components subscribed to that atom:

```jsx
import React from 'react';
import { useAtomState } from 'atom-state';

export default function Counter() {
  const [count, setCount] = useAtomState('count'); // access the atom by it's key

  return (
    <div>
      current count: {count}
      <div>
        <button onClick={() => setCount(c => c + 1)}>increase</button>{" "}
        <button onClick={() => setCount(0)}>reset</button>{" "}
        <button onClick={() => setCount(c => c - 1)}>decrease</button>
      </div>
    </div>
  );
}

```

[![Edit Counter Example for atom-state](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/counter-example-for-atom-state-qs72g?fontsize=14&hidenavigation=1&theme=dark)
