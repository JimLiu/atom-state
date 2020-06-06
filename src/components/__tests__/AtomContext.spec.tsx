import React, { useContext, FunctionComponent } from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AtomContext, { DefaultAtomStore } from '../AtomContext'
import { createStore } from '../../core/AtomStore'

test('AtomContext has a default store value', () => {
  const TestComponent: FunctionComponent = () => {
    const store = useContext(AtomContext)
    return <span>{(store instanceof DefaultAtomStore).toString()}</span>
  }

  const { getByText } = render(<TestComponent />)
  expect(getByText(/^true/)).toHaveTextContent('true')
})

const TestComponent: FunctionComponent = () => {
  const store = useContext(AtomContext)
  return <span>{store.getAtomValue('name')}</span>
}

test('AtomContext throws exception when it has a default store value', () => {
  expect(() => {
    render(<TestComponent />)
  }).toThrow(/must be used inside a <AtomRoot> component/)
})

test('AtomContext does not throw exception when it is passed a store value', () => {
  const store = createStore()

  expect(() => {
    render(
      <AtomContext.Provider value={store}>
        <TestComponent />
      </AtomContext.Provider>
    )
  }).not.toThrowError()
})
