import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { trpc } from '../utils/trpc';
import { Task } from '../pages/[filter]';

export function ListItem({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useQueryUtils();
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setText(task.text);
  }, [task.text]);

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  const editTask = trpc.useMutation('todos.edit', {
    onSettled: () => utils.invalidateQuery(['todos.all']),
  });
  const deleteTask = trpc.useMutation('todos.delete', {
    onSettled: () => utils.invalidateQuery(['todos.all']),
  });

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
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setCompleted(checked);
            editTask.mutate({
              id: task.id,
              data: { completed: checked, text: task.text },
            });
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
        <button
          className="destroy"
          onClick={() => {
            deleteTask.mutate(task.id);
          }}
        />
      </div>
      <input
        className="edit"
        value={text}
        ref={inputRef}
        onChange={(e) => {
          const newText = e.currentTarget.value;
          setText(newText);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            editTask.mutate({
              id: task.id,
              data: { text, completed: task.completed },
            });
            setEditing(false);
          }
        }}
      />
    </li>
  );
}
