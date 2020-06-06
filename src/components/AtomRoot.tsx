import React, { FunctionComponent } from 'react'
import AtomContext from './AtomContext'
import AtomStore from '../core/AtomStore'

type AtomRootProps = {
  store: AtomStore
  children: any
}

const AtomRoot: FunctionComponent<AtomRootProps> = ({ store, children }) => (
  <AtomContext.Provider value={store}>{children}</AtomContext.Provider>
)

export default AtomRoot
