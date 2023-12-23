import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import Todos from "~/components/todos";
import type { Todo } from "~/components/todos/TodoCard";
import auth, { client } from "~/services/auth.server";
import clientAuth from "~/services/auth";
import { transformSearchParams } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix + Edgedb Auth" },
    { name: "description", content: "This is a basic Todo app." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const builtinUIEnabled = await client.queryRequiredSingle<boolean>(
    `select exists ext::auth::UIConfig`
  );

  const session = auth.getSession(request);
  const isSignedIn = await session.isSignedIn();
  const todos = isSignedIn
    ? await session.client.query<Todo>(
        `select Todo {id, content, completed, created_on}
    order by .created_on desc`
      )
    : null;

  const username = isSignedIn
    ? await session.client.queryRequiredSingle<string>(
        `select global currentUser.name`
      )
    : null;

  return json({
    builtinUIEnabled,
    isSignedIn,
    todos,
    username,
  });
};

export default function Index() {
  const { builtinUIEnabled, isSignedIn, todos, username } =
    useLoaderData<typeof loader>();

  const [urlSearchParams] = useSearchParams();

  const params = transformSearchParams(urlSearchParams);

  if (isSignedIn) {
    return (
      <main className="h-screen flex justify-center">
        <Todos
          todos={todos}
          username={username}
          signoutUrl={clientAuth.getSignoutUrl()}
        />
      </main>
    );
  }

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="p-8 min-w-[32rem] w-min">
        <h1 className="text-3xl font-semibold">Todo Example App</h1>
        <h2 className="text-xl text-slate-600">Remix + EdgeDB Auth</h2>

        <p className="my-4">
          This is a simple todo example app to demonstrate how to integrate
          EdgeDB Auth into your{" "}
          <a href="https://remix.run/" className="text-sky-600">
            Remix
          </a>{" "}
          app, with the help of the{" "}
          <code className="bg-slate-50 p-1 rounded-md">@edgedb/auth-remix</code>{" "}
          library.
        </p>

        <p className="my-4">
          To start you need to login with either the custom login page, built
          using api's provided by the auth helper library, or with the EdgeDB's
          Builtin login UI.
        </p>

        {params.error || params.info ? (
          <div
            className={`${
              params.error
                ? "bg-rose-100 text-rose-950"
                : "bg-sky-200 text-sky-950"
            } px-4 py-3 rounded-md`}
          >
            {params.error || params.info}
          </div>
        ) : null}

        <div className="flex gap-5 mt-6 items-start w-max">
          <Link
            className="block rounded-lg bg-slate-50 py-3 px-5 font-medium shadow-md shrink-0 hover:bg-white hover:scale-[1.03] transition-transform"
            to="/signin"
          >
            Sign in with custom UI
          </Link>
          <div className="w-min">
            <Link
              className={`block rounded-lg bg-slate-50 py-3 px-5 font-medium shadow-md shrink-0 whitespace-nowrap hover:bg-white hover:scale-[1.03] transition-transform ${
                !builtinUIEnabled ? "opacity-60 pointer-events-none" : ""
              }`}
              to={clientAuth.getBuiltinUIUrl()}
            >
              Sign in with ✨Built-in UI✨
            </Link>
            {!builtinUIEnabled ? (
              <div className="text-center mx-3 mt-3 text-slate-600 text-sm">
                You need to enable the built-in UI in the auth config
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = auth.getSession(request);

  const data = await request.formData();

  if (request.method === "POST") {
    await session.client.query(
      `
        insert Todo {
          content := <str>$content
        }`,
      { content: data.get("newTodo")?.toString() }
    );
  }

  if (request.method === "PUT") {
    const todo = data.get("todo");
    const { id, completed } = JSON.parse(todo as string);

    await session.client.query(
      `
        update Todo
        filter .id = <uuid>$id
        set {
          completed := <bool>$completed
        }`,
      { id, completed: !completed }
    );
  }

  if (request.method === "DELETE") {
    const todo = data.get("todo");

    const { id } = JSON.parse(todo as string);

    await session.client.query(
      `
        delete Todo
        filter .id = <uuid>$id`,
      { id }
    );
  }

  return null;
}
