import React from 'react'
import ReactDOM from 'react-dom'
import { AtomRoot } from 'atom-state'
import './index.css'
import App from './App'
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <AtomRoot store={store}>
      <App />
    </AtomRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
