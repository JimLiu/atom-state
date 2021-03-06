import React from 'react'
import ReactDOM from 'react-dom'
import { AtomRoot } from 'atom-state'
import './index.css'
import Counter from './Counter'
import store from './store'
import CountInfo from './CountInfo'

ReactDOM.render(
  <React.StrictMode>
    <AtomRoot store={store}>
      <Counter />
      <CountInfo />
    </AtomRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
