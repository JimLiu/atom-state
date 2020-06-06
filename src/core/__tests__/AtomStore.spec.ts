import AtomStore, { createStore } from '../AtomStore'

test('AtomStore can be initialized with empty param', () => {
  let store = new AtomStore()
  expect(store).not.toBeNull()
})

test('AtomStore can be initialized with a Map param', () => {
  let atomValues = new Map()
  let store = new AtomStore(atomValues)
  expect(store).not.toBeNull()
})

test('AtomStore can be initialized by createStore', () => {
  let atomValues = new Map()
  let store = createStore(atomValues)
  expect(store).not.toBeNull()
})

test('AtomStore can get an atom value by key', () => {
  let atomValues = new Map([['foo', 'bar']])
  let store = new AtomStore(atomValues)
  expect(store.getAtomValue('foo')).toEqual('bar')
})

test('AtomStore can set an atom value', () => {
  let atomValues = new Map([['foo', 'bar']])

  let store = new AtomStore(atomValues)
  store.setAtomValue('foo', 'new bar')
  expect(store.getAtomValue('foo')).toEqual('new bar')
})

test('AtomStore should not set an atom value if key does not exists', () => {
  let atomValues = new Map([['bar', 'foo']])

  let store = new AtomStore(atomValues)
  store.setAtomValue('foo', 'bar')
  expect(store.getAtomValue('foo')).toBeUndefined()
})

test('AtomStore can subscribe the atom value change', () => {
  let atomValues = new Map([['foo', 'bar']])

  let store = new AtomStore(atomValues)
  store.subscribe('foo', value => {
    expect(value).toEqual('new bar')
  })
  store.setAtomValue('foo', 'new bar')
})

test('AtomStore call lisener once after the atom value change', () => {
  let atomValues = new Map([['foo', 'bar']])

  const mockLisener = jest.fn()
  let store = new AtomStore(atomValues)
  store.subscribe('foo', mockLisener)
  store.setAtomValue('foo', 'new bar')

  setTimeout(() => {
    expect(mockLisener.mock.calls.length).toBe(1)
  })
})

test('AtomStore can unsubscribe the atom value change', () => {
  let atomValues = new Map([['foo', 'bar']])

  const mockLisener = jest.fn()
  let store = new AtomStore(atomValues)
  store.subscribe('foo', mockLisener)
  store.unsubscribe('foo', mockLisener)
  store.setAtomValue('foo', 'new bar')

  setTimeout(() => {
    expect(mockLisener.mock.calls.length).toBe(0)
  })
})

test('AtomStore unsubscribe a not subscribed key', () => {
  let atomValues = new Map([['foo', 'bar']])

  const mockLisener = jest.fn()
  let store = new AtomStore(atomValues)
  store.unsubscribe('foo', mockLisener)
  store.setAtomValue('foo', 'new bar')

  setTimeout(() => {
    expect(mockLisener.mock.calls.length).toBe(0)
  })
})

test('AtomStore notifies changes', () => {
  let atomValues = new Map([
    ['foo', 'bar'],
    ['bar', 'foo']
  ])

  const mockFooLisener = jest.fn()
  const mockBarLisener = jest.fn()
  let store = new AtomStore(atomValues)
  store.subscribe('foo', mockFooLisener)
  store.subscribe('bar', mockBarLisener)
  store.notifyChanges(['foo', 'bar'])

  setTimeout(() => {
    expect(mockFooLisener.mock.calls.length).toBe(1)
    expect(mockBarLisener.mock.calls.length).toBe(1)
  })
})
