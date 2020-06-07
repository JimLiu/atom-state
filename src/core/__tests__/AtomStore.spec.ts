import AtomStore from '../AtomStore'
import createStore from '../../utils/createStore'

describe('new AtomStore()', () => {
  test('AtomStore can be initialized with empty param', () => {
    const store = new AtomStore()
    expect(store).not.toBeNull()
  })

  test('AtomStore can be initialized with a Map param', () => {
    let atomValues = new Map()
    const store = new AtomStore(atomValues)
    expect(store).not.toBeNull()
  })
})

describe('getAtomValue()', () => {
  test('get an atom value by key', () => {
    const store = createStore({ foo: 'bar' })
    expect(store.getAtomValue('foo')).toEqual('bar')
  })

  test('get an async atom value by key', () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve('bar'))
    expect(store.getAtomValue('foo')).toBeUndefined()
  })

  test('get an fallback value for an async atom', () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve('bar'), 'loading')
    expect(store.getAtomValue('foo')).toBe('loading')
  })

  test('get a loaded async atom value by key', async () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve('bar'))
    expect(store.getAtomValue('foo')).toBeUndefined()
    await (() => new Promise(resolve => setImmediate(resolve)))
    expect(store.getAtomValue('foo')).toEqual('bar')
  })
})

describe('setAtomValue()', () => {
  test('should set an atom value', () => {
    const store = createStore({ foo: 'bar' })
    store.setAtomValue('foo', 'new bar')
    expect(store.getAtomValue('foo')).toEqual('new bar')
  })

  test('should not set an atom value if key does not exists', () => {
    const store = createStore({ bar: 'foo' })
    store.setAtomValue('foo', 'bar')
    expect(store.getAtomValue('foo')).toBeUndefined()
  })

  test('should not set an atom value for an async atom', () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve('bar'), 'loading')
    store.setAtomValue('foo', 'bar')
    expect(store.getAtomValue('foo')).toBe('loading')
  })
})

describe('subscribeAtom()', () => {
  test('AtomStore can subscribe the atom value change', () => {
    const store = createStore({ foo: 'bar' })
    store.subscribeAtom('foo', value => {
      expect(value).toEqual('new bar')
    })
    store.setAtomValue('foo', 'new bar')
  })

  test('AtomStore call lisener once after the atom value change', () => {
    const mockLisener = jest.fn()
    const store = createStore({ foo: 'bar' })
    store.subscribeAtom('foo', mockLisener)
    store.setAtomValue('foo', 'new bar')

    setTimeout(() => {
      expect(mockLisener.mock.calls.length).toBe(1)
    })
  })
})

describe('unsubscribeAtom()', () => {
  test('AtomStore can unsubscribe the atom value change', () => {
    const mockLisener = jest.fn()
    const store = createStore({ foo: 'bar' })
    store.subscribeAtom('foo', mockLisener)
    store.unsubscribeAtom('foo', mockLisener)
    store.setAtomValue('foo', 'new bar')

    setTimeout(() => {
      expect(mockLisener.mock.calls.length).toBe(0)
    })
  })

  test('AtomStore unsubscribe a not subscribed key', () => {
    const store = createStore({ foo: 'bar' })

    const mockLisener = jest.fn()
    store.unsubscribeAtom('foo', mockLisener)
    store.setAtomValue('foo', 'new bar')

    setTimeout(() => {
      expect(mockLisener.mock.calls.length).toBe(0)
    })
  })
})

describe('containsAtom()', () => {
  test('return true if atom exists', () => {
    const store = createStore({ foo: 'bar' })
    expect(store.containsAtom('foo')).toBe(true)
    expect(store.containsAtom('bar')).toBe(false)
  })
})

describe('isAsyncAtom()', () => {
  test('return false for a normal atom', () => {
    const store = createStore({ foo: 'bar' })
    expect(store.isAsyncAtom('foo')).toBe(false)
  })

  test('return false for a not exist atom', () => {
    const store = createStore({ foo: 'bar' })
    expect(store.isAsyncAtom('bar')).toBe(false)
  })

  test('return true for a sync atom', () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve())
    expect(store.isAsyncAtom('foo')).toBe(true)
  })
})

describe('notifyAtomsChange()', () => {
  test('AtomStore notifies changes', () => {
    let atomValues = new Map([
      ['foo', 'bar'],
      ['bar', 'foo']
    ])

    const mockFooLisener = jest.fn()
    const mockBarLisener = jest.fn()
    const store = new AtomStore(atomValues)
    store.subscribeAtom('foo', mockFooLisener)
    store.subscribeAtom('bar', mockBarLisener)
    store.notifyAtomsChange(['foo', 'bar'])

    setTimeout(() => {
      expect(mockFooLisener.mock.calls.length).toBe(1)
      expect(mockBarLisener.mock.calls.length).toBe(1)
    })
  })
})

describe('registerAtom()', () => {
  test('should register an atom', () => {
    const store = createStore({ foo: 'bar' })
    expect(store.getAtomValue('bar')).toBeUndefined()

    store.registerAtom('bar', 'foo')
    expect(store.getAtomValue('bar')).toBe('foo')
  })

  test('should not register an atom if key exists', () => {
    const store = createStore({ foo: 'bar' })

    const result = store.registerAtom('foo', 'foo')
    expect(result).toBe(false)
    expect(store.getAtomValue('foo')).toBe('bar')
  })
})

describe('registerAsyncAtom()', () => {
  test('should register an async atom', () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve('bar'))
    expect(store.containsAtom('foo')).toBe(true)
    expect(store.isAsyncAtom('foo')).toBe(true)
    expect(store.getAtomValue('foo')).toBeUndefined()
    setTimeout(() => {
      expect(store.getAtomValue('foo')).toBe('bar')
    })
  })

  test('should not register an async atom if key exists', () => {
    const store = createStore({ foo: 'bar' })

    const result = store.registerAsyncAtom('foo', Promise.resolve('bar'))
    expect(result).toBe(false)
    expect(store.getAtomValue('foo')).toBe('bar')
    expect(store.isAsyncAtom('foo')).toBe(false)
  })

  test('should register an async atom with Promise.reject', () => {
    const store = createStore()
    store.registerAsyncAtom(
      'foo',
      Promise.reject('bar'),
      (status: any) => status
    )

    expect(store.getAtomValue('foo')).toBe('loading')
    setTimeout(() => {
      expect(store.getAtomValue('foo')).toBe('failed')
    })
  })
})

describe('removeAtom()', () => {
  test('should remove an exist atom', () => {
    const store = createStore({ foo: 'bar' })
    store.removeAtom('foo')
    expect(store.containsAtom('foo')).toBe(false)
  })

  test('should remove an exist async atom', () => {
    const store = createStore()
    store.registerAsyncAtom('foo', Promise.resolve('bar'))
    store.removeAtom('foo')
    expect(store.containsAtom('foo')).toBe(false)
    expect(store.isAsyncAtom('foo')).toBe(false)
  })

  test('should not remove a not exist atom', () => {
    const store = createStore()
    store.removeAtom('foo')
    expect(store.containsAtom('foo')).toBe(false)
  })
})
