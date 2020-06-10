import createStore from '../createStore'
import AtomStore from '../../core/AtomStore'

test('create store with empty parms', () => {
  let store = createStore()
  expect(store instanceof AtomStore).toBe(true)
  expect(store._atomValues.size).toBe(0)
})

test('create store with a Map', () => {
  let atoms = new Map([
    ['foo', 'bar'],
    ['name', 'atom-state']
  ])
  let store = createStore(atoms)
  expect(store instanceof AtomStore).toBe(true)
  expect(store instanceof AtomStore).toBe(true)
  expect(store._atomValues.size).toBe(2)
})

describe('create store with an object parms', () => {
  test('should create with a key value object', () => {
    let store = createStore({
      foo: 'bar',
      name: 'atom-state'
    })
    expect(store instanceof AtomStore).toBe(true)
    expect(store instanceof AtomStore).toBe(true)
    expect(store._atomValues.size).toBe(2)
  })

  test('should create with a null/0 value', () => {
    let store = createStore({
      foo: 0,
      name: null
    })
    expect(store instanceof AtomStore).toBe(true)
    expect(store instanceof AtomStore).toBe(true)
    expect(store._atomValues.size).toBe(2)
  })
})

describe('create store with an DefaultAtomType', () => {
  test('create store with an DefaultAtomType', () => {
    let store = createStore([
      {
        key: 'foo',
        default: 'bar'
      },
      {
        key: 'name',
        default: 'atom-state'
      },
      {
        key: '1',
        default: '1'
      },
      {
        key: 1, // should be a different key with '1'
        default: 1
      },
      {
        key: Symbol('name'),
        default: 'atom-state symbol'
      }
    ])
    expect(store instanceof AtomStore).toBe(true)
    expect(store._atomValues.size).toBe(5)
  })

  test('create store with a null/0/ default value', () => {
    let store = createStore([
      {
        key: 'foo',
        default: 0
      },
      {
        key: 'name',
        default: null
      },
      {
        key: 'undefined',
        default: undefined
      }
    ])
    expect(store instanceof AtomStore).toBe(true)
    expect(store._atomValues.size).toBe(3)
  })
})

test('create store with an array', () => {
  let store = createStore([
    ['foo', 'bar'],
    ['name', 'atom-state']
  ])
  expect(store instanceof AtomStore).toBe(true)
  expect(store instanceof AtomStore).toBe(true)
  expect(store._atomValues.size).toBe(2)
})
