import React from 'react'
import FilterLink from './FilterLink'

export default function Footer () {
  return (
    <div>
      <span>Show: </span>
      <FilterLink filter='all'>All</FilterLink>
      <FilterLink filter='active'>Active</FilterLink>
      <FilterLink filter='completed'>Completed</FilterLink>
    </div>
  )
}
