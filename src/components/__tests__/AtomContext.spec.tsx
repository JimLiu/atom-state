import React, { useContext, FunctionComponent } from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AtomContext, { DefaultAtomStore } from '../AtomContext'
import createStore from '../../utils/createStore'

const consoleError = console.error.bind(console)

test('AtomContext has a default store value', () => {
  const TestComponent: FunctionComponent = () => {
    const store = useContext(AtomContext)
    return <span>{(store instanceof DefaultAtomStore).toString()}</span>
  }

  const { getByText } = render(<TestComponent />)
  expect(getByText(/^true/)).toHaveTextContent('true')
})

type TestComponentProps = {
  atomKey: string
}

const TestComponent: FunctionComponent<TestComponentProps> = ({ atomKey }) => {
  const store = useContext(AtomContext)
  return (
    <span>
      {store.getAtomValue(atomKey)}
      {store.containsAtom(atomKey)}
    </span>
  )
}

describe('Throws exception', () => {
  beforeAll(() => {
    global.console.error = () => {}
  })
  afterAll(() => {
    global.console.error = consoleError
  })

  test('AtomContext throws exception when it has a default store value', () => {
    expect(() => {
      render(<TestComponent atomKey='name' />)
    }).toThrow(/must be used inside a <AtomRoot> component/)
  })

  test('AtomContext throws exception when it has a default store value', () => {
    expect(() => {
      render(<TestComponent atomKey='name' />)
    }).toThrow(/must be used inside a <AtomRoot> component/)
  })
})

test('AtomContext does not throw exception when it is passed a store value', () => {
  const store = createStore()
  expect(() => {
    render(
      <AtomContext.Provider value={store}>
        <TestComponent atomKey='name' />
      </AtomContext.Provider>
    )
  }).not.toThrowError()
})
