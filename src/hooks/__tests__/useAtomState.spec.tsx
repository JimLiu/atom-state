import React, { FunctionComponent } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'

import AtomRoot from '../../components/AtomRoot'
import createStore from '../../utils/createStore'
import useAtomState from '../useAtomState'

test('useAtomState should return the atom state', () => {
  const store = createStore({ name: 'Atom' })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result } = renderHook(() => useAtomState('name'), { wrapper })

  expect(result.current[0]).toEqual('Atom')
})

test('useAtomState should set the atom state', async () => {
  const store = createStore({ name: 'Atom' })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result, waitForNextUpdate } = renderHook(() => useAtomState('name'), {
    wrapper
  })

  await act(async () => {
    const [, setName] = result.current
    setName('Junmin')
    await waitForNextUpdate()
  })

  expect(result.current[0]).toEqual('Junmin')
})

test('useAtomState should sync up the atom state between two components', async () => {
  const defaultAtoms = new Map()
  defaultAtoms.set('name', 'Atom')

  const store = createStore(defaultAtoms)

  const Test1Component: FunctionComponent = () => {
    const [name, setName] = useAtomState('name')

    return (
      <div>
        <button
          onClick={() => {
            setName('Junmin')
          }}
        >
          change name
        </button>
        <span>name1: {name}</span>
      </div>
    )
  }
  const Test2Component: FunctionComponent = () => {
    const [name] = useAtomState('name')

    return <span>name2: {name}</span>
  }

  const { getByText } = render(
    <AtomRoot store={store}>
      <Test1Component />
      <Test2Component />
    </AtomRoot>
  )

  expect(getByText(/^name2:/)).toHaveTextContent('name2: Atom')

  fireEvent.click(screen.getByText('change name'))

  await screen.findAllByText(/Junmin/)

  expect(getByText(/^name2:/)).toHaveTextContent(/name2: Junmin/)
})
