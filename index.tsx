import React, { Suspense } from 'react';
import { render } from 'react-dom';
import './style.css';

import { get as getItem, set as setItem } from 'idb-keyval';
import { useAtom, Provider } from 'jotai';
import { useReducerAtom, atomWithStorage } from 'jotai/utils';

function atomWithAsyncStorage<T>(key: string, initial: T) {
  return atomWithStorage<T>(key, initial, {
    setItem,
    getItem: (key) => getItem<T>(key).then((value) => value ?? initial),
  });
}

const countAtom = atomWithAsyncStorage('count', 0);

function App() {
  return (
    <Provider>
      <Suspense fallback="loading...">
        <SimpleComp />
        <ReducerComp />
      </Suspense>
    </Provider>
  );
}

function SimpleComp() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <div>
      <p>Count with storage: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>inc</button>
      <button onClick={() => setCount((c) => c - 1)}>dec</button>
    </div>
  );
}

const countReducer = (prev: number, action: { type: 'inc' | 'dec' }) => {
  if (action.type === 'inc') return prev + 1;
  if (action.type === 'dec') return prev - 1;
  throw new Error('unknown action type');
};

function ReducerComp() {
  const [count, dispatch] = useReducerAtom(countAtom, countReducer);
  return (
    <div>
      <p>Count with storage and reducer: {count}</p>
      <button onClick={() => dispatch({ type: 'inc' })}>inc</button>
      <button onClick={() => dispatch({ type: 'dec' })}>dec</button>
    </div>
  );
}

render(<App />, document.getElementById('root'));
