import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';

import axios, {AxiosError} from 'axios';
import clsx from 'clsx';
import Head from 'next/head';
import {useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';

import {ListItem} from '../components/ListItem';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

const onError = (err: AxiosError) => {
  alert(err?.response?.data);
};
export default function TodosPage() {
  const allTasks = useQuery<Task[]>('todos', () =>
    axios.get('/api/todo').then((res) => res.data)
  );
  const refetchTasks = allTasks.refetch as () => void;

  const addTask = useMutation(
    (text: string) => axios.post('/api/todo', {text}),
    {onSuccess: refetchTasks, onError}
  );

  const toggleTask = useMutation(
    (id: string) => {
      return axios.patch(`/api/todo/${id}`);
    },
    {
      onSuccess: refetchTasks,
      onError,
    }
  );

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  if (allTasks.isLoading) return 'Loading...';
  const filteredTasks: Task[] =
    allTasks.data?.filter((task) => {
      if (filter === 'active') {
        return !task.completed;
      }
      if (filter === 'completed') {
        return task.completed;
      }
      return true;
    }) || [];

  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyDown={(e) => {
              const text = e.currentTarget.value.trim();
              if (e.key === 'Enter' && text) {
                addTask.mutate(text);
                e.currentTarget.value = '';
              }
            }}
          />
        </header>
        {/* This section should be hidden by default and shown when there are todos */}
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/* These are here just to show the structure of the list items */}
            {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
            {filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                task={task}
                toggleTask={toggleTask.mutate}
              />
            ))}
          </ul>
        </section>
        {/* This footer should be hidden by default and shown when there are todos */}
        <footer className="footer">
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>
              {allTasks.data?.reduce(
                (sum, task) => (!task.completed ? sum + 1 : sum),
                0
              )}
            </strong>
            {` item${filteredTasks.length > 1 ? 's' : ''} left`}
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <a
                style={{cursor: 'pointer'}}
                className={clsx(
                  !['active', 'completed'].includes(filter as string) &&
                    'selected'
                )}
                onClick={() => setFilter('all')}
              >
                All
              </a>
            </li>
            <li>
              <a
                style={{cursor: 'pointer'}}
                className={clsx(filter === 'active' && 'selected')}
                onClick={() => setFilter('active')}
              >
                Active
              </a>
            </li>
            <li>
              <a
                style={{cursor: 'pointer'}}
                className={clsx(filter === 'completed' && 'selected')}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </li>
          </ul>
        </footer>
      </section>
      <footer className="info">
        {/* Change this out with your name and url ↓ */}
        <p>
          Created with <a href="http://edgedb.com">EdgeDB</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
