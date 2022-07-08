/** @jsx h */
import {h} from 'preact';
import {IS_BROWSER} from '$fresh/runtime.ts';

interface CounterProps {
  value: number;
}

export default function Counter(props: CounterProps) {
  return (
    <div>
      <p>{props.value}</p>
      <form>
        <button name="formName" value={'decrement'} disabled={!IS_BROWSER}>
          -1
        </button>
      </form>
      <form>
        {' '}
        <button name="formName" value={'increment'} disabled={!IS_BROWSER}>
          +1
        </button>
      </form>
    </div>
  );
}
