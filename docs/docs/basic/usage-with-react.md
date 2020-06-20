---
title: Usage with React
---

## Designing Component Hierarchy

Our design brief is simple. We want to show a list of todo items. On click, a todo item is crossed out as completed. We want to show a field where the user may add a new todo. In the footer, we want to show a toggle to show all, only completed, or only active todos.

The following components and their props or atom state emerge from this brief:

- `TodoList` is a list showing visible todos. It filters the todos according to the current visibility filter.
  - `todos: Array` is an array of todo items with { id, text, completed } shape.
  - `visibilityFilter: string` is the current visibility filter.
- `Todo` is a single todo item.
  - `text: string` is the text to show.
  - `completed: boolean` is whether the todo should appear crossed out.
  - `onClick()` is a callback to invoke when the todo is clicked.
- `FilterLink` gets the current visibility filter and renders a link.
  - `filter: string` is the visibility filter it represents.
- `Footer` is where we let the user change currently visible todos.
- `AddTodo` is an input field with an “Add” button
- `App` is the root component that renders everything else.

## Implementing Components

Let's write the components!



### `components/Todo.js`

```jsx
import React from "react";

export default function Todo({ onClick, completed, text }) {
  return (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none"
      }}
    >
      {text}
    </li>
  );
}

```

### `components/TodoList.js`

```jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAtomState, useAtomValue } from "atom-state";
import Todo from "./Todo";

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "all":
      return todos;
    case "completed":
      return todos.filter(t => t.completed);
    case "active":
      return todos.filter(t => !t.completed);
    default:
      throw new Error("Unknown filter: " + filter);
  }
};

export default function TodoList() {
  const [todos, setTodos] = useAtomState("todos");
  const visibilityFilter = useAtomValue("visibilityFilter");

  const [visibleTodos, setVisibleTodos] = useState(todos);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, visibilityFilter));
  }, [todos, visibilityFilter]);

  const toggleTodo = useCallback(
    id => {
      setTodos(state =>
        state.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  return (
    <ul>
      {visibleTodos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)} />
      ))}
    </ul>
  );
}
```

### `components/FilterLink.js`

```jsx
import React, { useCallback } from "react";
import { useAtomState } from "atom-state";

export default function FilterLink({ filter, children }) {
  const [visibilityFilter, setVisibilityFilter] = useAtomState(
    "visibilityFilter"
  );

  const handleClick = useCallback(() => {
    setVisibilityFilter(filter);
  }, [setVisibilityFilter, filter]);

  const active = filter === visibilityFilter;

  return (
    <button
      onClick={handleClick}
      disabled={active}
      style={{
        marginLeft: "4px"
      }}
    >
      {children}
    </button>
  );
}

```

### `components/Footer.js`

```jsx
import React from "react";
import FilterLink from "./FilterLink";

export default function Footer() {
  return (
    <div>
      <span>Show: </span>
      <FilterLink filter="all">All</FilterLink>
      <FilterLink filter="active">Active</FilterLink>
      <FilterLink filter="completed">Completed</FilterLink>
    </div>
  );
}
```

### `components/AddTodo.js`

```jsx
import React, { useRef } from "react";
import { useSetAtomState } from "atom-state";

let nextTodoId = 10;

export default function AddTodo() {
  let inputRef = useRef();
  const setTodoItems = useSetAtomState("todos");

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!inputRef.current.value.trim()) {
            return;
          }
          setTodoItems(items => [
            ...items,
            {
              id: nextTodoId++,
              text: inputRef.current.value,
              completed: false
            }
          ]);
          inputRef.current.value = "";
        }}
      >
        <input ref={inputRef} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
```

### `App.js`

```jsx
import React from "react";
import Footer from "./components/Footer";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <div>
      <AddTodo />
      <TodoList />
      <Footer />
    </div>
  );
}
```

## Passing the Store

All components need access to the store so they can use the hooks to update atoms and subscribe to them. One option would be to pass it as a prop to every container component. However it gets tedious, as you have to wire store even through presentational components just because they happen to render a container deep in the component tree.

The option we recommend is to use a special React component called `<AtomRoot>` to magically make the store available to all components in the application without passing it explicitly. You only need to use it once when you render the root component:

### `index.js`

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { AtomRoot } from "atom-state";

import App from "./App";
import store from "./store";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <AtomRoot store={store}>
      <App />
    </AtomRoot>
  </React.StrictMode>,
  rootElement
);
```

[![Edit Todo Example for atom-state](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/todo-example-for-atom-state-u8h19?fontsize=14&hidenavigation=1&theme=dark)
