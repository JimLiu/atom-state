import React from 'react'
import { AtomRoot, createStore } from 'atom-state'
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react'
import Counter from './Counter'

function TestWrapper ({ children }) {
  const store = createStore({ count: 0 })
  return <AtomRoot store={store}>{children}</AtomRoot>
}

test('renders init count', () => {
  const { getByText } = render(
    <TestWrapper>
      <Counter />
    </TestWrapper>
  )
  const text = getByText(/clicked: 0 times/i)
  expect(text).toBeInTheDocument()
})
