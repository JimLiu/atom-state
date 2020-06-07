import { createStore } from 'atom-state';

// initialize the default atoms by an object
const store = createStore({ count: 0 });

/*
// initialize the default atoms by an array
// each item needs a `key` property and a `default` property
const store = createStore([
  {
    key: 'count',
    default: 0,
  }
]);
*/

export default store;
