import Batcher from '../Batcher'

test('Can create a Batcher instance', () => {
  const mockNotifyChanges = jest.fn()
  const batcher = new Batcher(mockNotifyChanges)
  expect(batcher).not.toBeNull()
})

test('Batcher calls notifyChanges', () => {
  const mockNotifyChanges = jest.fn()
  const batcher = new Batcher(mockNotifyChanges)
  batcher.notifyChange('foo')
  expect(mockNotifyChanges.mock.calls.length).toBe(0)
  setTimeout(() => {
    // notify changes in next run loop
    expect(mockNotifyChanges.mock.calls.length).toBe(1)
  })
})

test('Batcher calls notifyChanges twice in two runloops', () => {
  const mockNotifyChanges = jest.fn()
  const batcher = new Batcher(mockNotifyChanges)
  batcher.notifyChange('foo')
  batcher.notifyChange('bar')
  setTimeout(() => {
    batcher.notifyChange('foo')
    batcher.notifyChange('bar')
    setTimeout(() => {
      expect(mockNotifyChanges.mock.calls.length).toBe(2)
    })
  })
})

test('Batcher calls dispatchQueue', () => {
  const mockNotifyChanges = jest.fn()
  const batcher = new Batcher(mockNotifyChanges)
  batcher.dispatchQueue()
  expect(mockNotifyChanges.mock.calls.length).toBe(1)
})

test('Batcher can notify change by key', () => {
  const mockListener = jest.fn()
  function notifyChanges (keys: Set<any> | Array<any>): void {
    keys.forEach(mockListener)
  }

  const batcher = new Batcher(notifyChanges)
  batcher.notifyChange('foo')
  batcher.notifyChange('bar')
  batcher.notifyChange('foo')

  // do not notify change immediately
  expect(mockListener.mock.calls.length).toBe(0)
  expect(batcher.keys.size).toBe(2)
  setTimeout(() => {
    // notify changes in next run loop
    expect(batcher.keys.size).toBe(0)
    expect(mockListener.mock.calls.length).toBe(2)
  })
})

test('Batcher can notify change by key', () => {
  const mockListener = jest.fn()
  function notifyChanges (keys: Set<any> | Array<any>): void {
    keys.forEach(mockListener)
  }

  const batcher = new Batcher(notifyChanges)
  batcher.notifyChange('foo')
  batcher.notifyChange('bar')

  setTimeout(() => {
    batcher.notifyChange('hello')
    expect(batcher.keys.size).toBe(1)
    setTimeout(() => {
      expect(mockListener.mock.calls.length).toBe(3)
    })
  })
})
