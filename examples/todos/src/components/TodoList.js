import React, { useState, useEffect, useCallback } from 'react'
import { useAtomState, useAtomValue } from 'atom-state'
import Todo from './Todo'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'all':
      return todos
    case 'completed':
      return todos.filter(t => t.completed)
    case 'active':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

export default function TodoList () {
  const [todos, setTodos] = useAtomState('todos')
  const visibilityFilter = useAtomValue('visibilityFilter')

  const [visibleTodos, setVisibleTodos] = useState(todos)

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, visibilityFilter))
  }, [todos, visibilityFilter])

  const toggleTodo = useCallback(
    id => {
      setTodos(state =>
        state.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      )
    },
    [setTodos]
  )

  return (
    <ul>
      {visibleTodos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)} />
      ))}
    </ul>
  )
}
