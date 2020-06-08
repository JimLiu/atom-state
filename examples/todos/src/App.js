import React from 'react'
import Footer from './components/Footer'
import AddTodo from './components/AddTodo'
import TodoList from './components/TodoList'

import './App.css'

function App () {
  return (
    <div className='App'>
      <AddTodo />
      <TodoList />
      <Footer />
    </div>
  )
}

export default App
