---
title: Atom
---

In atom-state, all the atom state is stored as a key value pair. For our todo app, we want to store two different things:

- The currently selected visibility filter.
- The actual list of todos.

We'll call our filter atom `visibilityFilter` and our list atom `todos`, then create them with store:

```js
import { createStore } from "atom-state";

const todoAtoms = {
  visibilityFilter: "all",
  todos: [
    {
      id: 1,
      text: "Consider using atom-state!",
      completed: true
    },
    {
      id: 2,
      text: "Keep all state in key value pairs",
      completed: false
    }
  ]
};

const store = createStore(todoAtoms);

export default store;
```
