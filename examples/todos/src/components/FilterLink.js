import React, { useCallback } from 'react'
import { useAtomState } from 'atom-state'

export default function FilterLink ({ filter, children }) {
  const [visibilityFilter, setVisibilityFilter] = useAtomState(
    'visibilityFilter'
  )

  const handleClick = useCallback(() => {
    setVisibilityFilter(filter)
  }, [setVisibilityFilter, filter])

  const active = filter === visibilityFilter

  return (
    <button
      onClick={handleClick}
      disabled={active}
      style={{
        marginLeft: '4px'
      }}
    >
      {children}
    </button>
  )
}
