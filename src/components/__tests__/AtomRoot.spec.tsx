import React, { useContext, FunctionComponent } from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AtomContext from '../AtomContext'
import { createStore } from '../../core/AtomStore'
import AtomRoot from '../AtomRoot'

const TestComponent: FunctionComponent = () => {
  const store = useContext(AtomContext)
  return <span>name: {store.getAtomValue('name')}</span>
}

test('Throws exception when the component is not used inside a <AtomRoot> component', () => {
  expect(() => {
    render(<TestComponent />)
  }).toThrow(/must be used inside a <AtomRoot> component/)
})

test('Throws exception when the component is used inside a <AtomRoot> component without a store property', () => {
  expect(() => {
    render(<TestComponent />)
  }).toThrow(/must be used inside a <AtomRoot> component/)
})

test('Does not throw exception when it is used inside a AtomRoot with a store value', () => {
  const store = createStore()

  expect(() => {
    render(
      <AtomRoot store={store}>
        <TestComponent />
      </AtomRoot>
    )
  }).not.toThrowError()
})

test('Does not throw exception when it is used inside a AtomRoot with a store value', () => {
  const defaultAtoms = new Map()
  defaultAtoms.set('name', 'Atom')

  const store = createStore(defaultAtoms)

  const { getByText } = render(
    <AtomRoot store={store}>
      <TestComponent />
    </AtomRoot>
  )
  expect(getByText(/^name:/)).toHaveTextContent('name: Atom')
})
