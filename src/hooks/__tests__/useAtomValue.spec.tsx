import React, { FunctionComponent } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { renderHook } from '@testing-library/react-hooks'

import AtomRoot from '../../components/AtomRoot'
import createStore from '../../utils/createStore'
import useAtomValue from '../useAtomValue'

test('useAtomValue should return the atom value', () => {
  const store = createStore({ name: 'Atom' })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result } = renderHook(() => useAtomValue('name'), { wrapper })

  expect(result.current).toEqual('Atom')
})
