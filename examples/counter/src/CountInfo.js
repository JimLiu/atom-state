import React from 'react'
import { useAtomValue } from 'atom-state'

export default function CountInfo () {
  const count = useAtomValue('count')

  return <span>Clicked: {count} times (Info)</span>
}
