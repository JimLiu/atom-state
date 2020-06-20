---
title: Store
---

Store is the container for all the atoms. The store has the following responsibilities:

- Holds atom state;
- Allows access to atom via `getAtomValue(key)` or `getAtomPromise(key)`;
- Allows atom to be added or updated via `setAtomValue(key, value, option)`;
- Allows atom to be removed via `removeAtom(key)`;
- Registers listeners via `subscribeAtom(key, listener)`;
- Handles unregistering of listeners via the function returned by `subscribeAtom(key, listener)`.

It's important to note that you'll only have a single store in a `AtomRoot` component.

It's easy to create a store. You may optionally specify the initial atoms as an argument to `createStore()`. This is useful for hydrating the state of the client to match the state of an application running on the server.

```js
const store = createStore(todoAtoms)
```
