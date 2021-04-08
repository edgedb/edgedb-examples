import clsx from 'clsx';

import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { ReactQueryDevtools } from 'react-query/devtools';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import { ListItem } from '../components/ListItem';
import { trpc } from '../utils/trpc';
import { appRouter, createContext } from './api/trpc/[trpc]';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export default function TodosPage({
  filter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const allTasks = trpc.useQuery(['todos.all'], {
    staleTime: 3000,
  });

  const utils = trpc.useQueryUtils();
  const addTask = trpc.useMutation('todos.add', {
    onSettled: () => utils.invalidateQuery(['todos.all']),
  });
  const clearCompleted = trpc.useMutation('todos.clearCompleted', {
    onSettled: () => utils.invalidateQuery(['todos.all']),
  });

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
                addTask.mutate({ text });
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
            {allTasks.data
              ?.filter((task) => {
                if (filter === 'active') {
                  return !task.completed;
                }
                if (filter === 'completed') {
                  return task.completed;
                }
                return true;
              })
              .map((task) => (
                <ListItem key={task.id} task={task} allTasks={allTasks.data} />
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
            </strong>{' '}
            item left
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <Link href="/all">
                <a
                  className={clsx(
                    !['active', 'completed'].includes(filter as string) &&
                      'selected'
                  )}
                >
                  All
                </a>
              </Link>
            </li>
            <li>
              <Link href="/active">
                <a className={clsx(filter === 'active' && 'selected')}>
                  Active
                </a>
              </Link>
            </li>
            <li>
              <Link href="/completed">
                <a className={clsx(filter === 'completed' && 'selected')}>
                  Completed
                </a>
              </Link>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          {allTasks.data?.some((task) => task.completed) && (
            <button
              className="clear-completed"
              onClick={() => {
                clearCompleted.mutate(null);
              }}
            >
              Clear completed
            </button>
          )}
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        {/* Remove the below line ↓ */}
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
        {/* Change this out with your name and url ↓ */}
        <p>
          Created with <a href="http://trpc.io">tRPC</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['active', 'completed', 'all'].map((filter) => ({
      params: { filter },
    })),

    fallback: false,
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ filter: string }>
) => {
  return {
    props: {
      filter: context.params?.filter ?? 'all',
    },
  };
};
