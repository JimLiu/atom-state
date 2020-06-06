import React, { FunctionComponent } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { renderHook } from '@testing-library/react-hooks'

import { DefaultAtomStore } from '../../components/AtomContext'
import AtomRoot from '../../components/AtomRoot'
import createStore from '../../utils/createStore'
import useStore from '../useStore'

test('useStore should return a default store if there is no AtomContext', () => {
  const { result } = renderHook(() => useStore())

  expect(result.current).toBeInstanceOf(DefaultAtomStore)
})

test('useStore should return the store which passes to AtomContext', () => {
  const store = createStore()

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result } = renderHook(() => useStore(), { wrapper })

  expect(result.current).toEqual(store)
})
