import React, { useRef } from 'react'
import { useSetAtomState } from 'atom-state'

let nextTodoId = 10

export default function AddTodo () {
  let inputRef = useRef()
  const setTodoItems = useSetAtomState('todos')

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!inputRef.current.value.trim()) {
            return
          }
          setTodoItems(items => [
            ...items,
            {
              id: nextTodoId++,
              text: inputRef.current.value,
              completed: false
            }
          ])
          inputRef.current.value = ''
        }}
      >
        <input ref={inputRef} />
        <button type='submit'>Add Todo</button>
      </form>
    </div>
  )
}
