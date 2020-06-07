import React, { useCallback } from 'react'
import { useAtomState } from 'atom-state'

export default function Counter () {
  // call useAtomState by key
  const [count, setCount] = useAtomState('count')

  const onIncrement = useCallback(() => {
    setCount(count => count + 1)
  }, [setCount])

  const onDecrement = useCallback(() => {
    setCount(count => count - 1)
  }, [setCount])

  const incrementIfOdd = useCallback(() => {
    setCount(count => (count % 2 !== 0 ? count + 1 : count))
  }, [setCount])

  const incrementAsync = useCallback(() => {
    setTimeout(onIncrement, 1000)
  }, [onIncrement])

  return (
    <p>
      <span>Clicked: {count} times</span>{' '}
      <button onClick={onIncrement}>+</button>{' '}
      <button onClick={onDecrement}>-</button>{' '}
      <button onClick={incrementIfOdd}>Increment if odd</button>{' '}
      <button onClick={incrementAsync}>Increment async</button>
    </p>
  )
}
