import clsx from 'clsx';
import {useEffect, useState} from 'react';

import {Task} from '../pages';

export function ListItem({
  task,
  toggleTask,
}: {
  task: Task;
  toggleTask: (id: string, params?: any) => any;
}) {
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  return (
    <li key={task.id} className={clsx(completed && 'completed')}>
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
        />
        <label>{task.text}</label>
      </div>
    </li>
  );
}
