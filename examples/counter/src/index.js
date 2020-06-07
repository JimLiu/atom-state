import React from 'react'
import ReactDOM from 'react-dom'
import { AtomRoot } from 'atom-state'
import './index.css'
import Counter from './Counter'
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <AtomRoot store={store}>
      <Counter />
    </AtomRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
