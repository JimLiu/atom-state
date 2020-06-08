import { createStore } from 'atom-state'

const store = createStore({
  visibilityFilter: 'all',
  todos: [
    {
      id: 1,
      text: 'Hello world!',
      completed: false
    }
  ]
})

export default store
