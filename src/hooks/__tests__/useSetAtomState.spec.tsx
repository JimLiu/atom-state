import React, { FunctionComponent, useRef } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'

import AtomRoot from '../../components/AtomRoot'
import createStore from '../../utils/createStore'
import useSetAtomState from '../useSetAtomState'

test('useSetAtomState should set the atom state', () => {
  const store = createStore({ name: 'Atom' })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result, rerender } = renderHook(() => useSetAtomState('name'), {
    wrapper
  })

  act(() => {
    result.current('Junmin')
  })

  rerender()

  expect(store.getAtomValue('name')).toEqual('Junmin')
})

test('useSetAtomState should set the atom state with a function', () => {
  const store = createStore({ count: 1 })

  const wrapper: FunctionComponent = ({ children }) => (
    <AtomRoot store={store}>{children}</AtomRoot>
  )

  const { result, rerender } = renderHook(() => useSetAtomState('count'), {
    wrapper
  })

  act(() => {
    result.current((c: any) => c + 1)
  })

  rerender()

  expect(store.getAtomValue('count')).toEqual(2)
})

test('useSetAtomState should not cause re-render after atom changed', async () => {
  const store = createStore({ name: 'Atom' })
  const TestComponent: FunctionComponent = () => {
    const renderCountRef = useRef(0)
    useSetAtomState('name')
    renderCountRef.current++

    return <span>render count: {renderCountRef.current}</span>
  }

  const { getByText } = render(
    <AtomRoot store={store}>
      <TestComponent />
    </AtomRoot>
  )

  await act(async () => {
    store.setAtomValue('name', 'Junmin')
    await screen.findAllByText(/render count: 1/)
  })

  expect(getByText(/^render count:/)).toHaveTextContent('render count: 1')

  setTimeout(() => {
    expect(getByText(/^render count:/)).toHaveTextContent('render count: 1')
  })
})
