import React, { FunctionComponent } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { renderHook } from '@testing-library/react-hooks'

import AtomRoot from '../../components/AtomRoot'
import createStore from '../../utils/createStore'
import useAtomValue from '../useAtomValue'

const nextTick = () => new Promise(resolve => setImmediate(resolve))

test('useAtomValue should return the atom value', async () => {
  const store = createStore({ name: 'Atom' })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  await nextTick()
  const { result } = renderHook(() => useAtomValue('name'), { wrapper })

  expect(result.current).toEqual('Atom')
})
