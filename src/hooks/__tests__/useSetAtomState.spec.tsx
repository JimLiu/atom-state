import React, { FunctionComponent } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { renderHook, act } from '@testing-library/react-hooks'

import AtomRoot from '../../components/AtomRoot'
import createStore from '../../utils/createStore'
import useSetAtomState from '../useSetAtomState'

test('useSetAtomState should set the atom state', async () => {
  const store = createStore({ name: 'Atom' })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result, waitForNextUpdate } = renderHook(
    () => useSetAtomState('name'),
    {
      wrapper
    }
  )

  await act(async () => {
    result.current('Junmin')
    await waitForNextUpdate()
  })

  expect(store.getAtomValue('name')).toEqual('Junmin')
})
