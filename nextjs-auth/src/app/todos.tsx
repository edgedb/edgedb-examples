import { auth } from "@/edgedb";

import { TodosList, type Todo } from "./_components/todos";
import { SignOutButton } from "./_components/auth";

export async function TodosPage() {
  const session = auth.getSession();

  return (
    <main className="p-8 w-[40rem]">
      <UserHeader />

      <h1 className="text-3xl font-semibold">Todo's</h1>
      <TodosList
        todos={await session.client.query<Todo>(
          `select Todo {id, content, completed, created_on}
          order by .created_on desc`
        )}
      />
    </main>
  );
}

async function UserHeader() {
  const session = auth.getSession();
  const username = await session.client.querySingle<string>(
    `select global currentUser.name`
  );

  return (
    <div className="flex bg-slate-50 shadow-sm p-3 rounded-xl mb-8 items-center gap-3">
      <span className="mr-auto ml-2">
        <span className="text-slate-500">Signed in as </span>
        {username}
      </span>
      <a
        href={auth.getSignoutUrl()}
        className="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
      >
        Sign out
      </a>
      <SignOutButton />
    </div>
  );
}
