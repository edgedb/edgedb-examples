import clsx from 'clsx';
import {useEffect, useRef, useState} from 'react';

import {Task} from '../pages';

export function ListItem({
  task,
  toggleTask,
}: {
  task: Task;
  toggleTask: (id: string, params?: any) => any;
}) {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setText(task.text);
  }, [task.text]);

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  return (
    <li
      key={task.id}
      className={clsx(editing && 'editing', completed && 'completed')}
      ref={wrapperRef}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={task.completed}
          onChange={async (e) => {
            const checked = e.currentTarget.checked;
            setCompleted(checked);

            await toggleTask(task.id, {onError: () => setCompleted(!checked)});
          }}
          autoFocus={editing}
        />
        <label
          onDoubleClick={(e) => {
            setEditing(true);
            e.currentTarget.focus();
          }}
        >
          {text}
        </label>
        {/* <button
          className="destroy"
          onClick={() => {
            deleteTask(task.id);
          }}
        /> */}
      </div>
      <input
        className="edit"
        value={text}
        ref={inputRef}
        onChange={async (e) => {
          const newText = e.currentTarget.value;
          setText(newText);
        }}
        onKeyPress={async (e) => {
          if (e.key === 'Enter') {
            toggleTask(task.id, {
              onSuccess() {
                setEditing(false);
              },
              onError() {
                setText(task.text);
              },
            });
            setEditing(false);
          }
        }}
      />
    </li>
  );
}
