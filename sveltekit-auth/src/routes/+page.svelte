<script>
  import { page } from "$app/stores";
  import clientAuth from "$lib/auth";
  import TodoList from "$lib/components/todos/TodoList.svelte";
  import { transformSearchParams } from "$lib/utils";

  export let params = transformSearchParams($page.url.searchParams);
  export let data;
</script>

<main>
  {#if data.isSignedIn}
    <div class="p-8 w-[40rem]">
      <div
        class="flex bg-slate-50 shadow-sm p-3 rounded-xl mb-8 items-center gap-3"
      >
        <span class="mr-auto ml-2">
          <span class="text-slate-500">Signed in as </span>
          {data.username}
        </span>
        <a
          href={clientAuth.getSignoutUrl()}
          class="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
        >
          Sign out
        </a>
        <form action="/signout" method="post">
          <button
            class="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
            type="submit"
          >
            Sign out (action)
          </button>
        </form>
      </div>

      <h1 class="text-3xl font-semibold">Todo's</h1>
      <TodoList todos={data.todos} />
    </div>
  {:else}
    <div class="p-8 min-w-[32rem] w-min">
      <h1 class="text-3xl font-semibold text-start">Todo Example App</h1>
      <h2 class="text-xl text-slate-600">SvelteKit + EdgeDB Auth</h2>

      <p class="my-4">
        This is a simple todo example app to demonstrate how to integrate EdgeDB
        Auth into your{" "}
        <a href="https://kit.svelte.dev/" class="text-sky-600"> Svelte </a>{" "}
        app, with the help of the{" "}
        <code class="bg-slate-50 p-1 rounded-md">@edgedb/auth-sveltekit</code
        >{" "}
        library.
      </p>

      <p class="my-4">
        To start you need to login with either the custom login page, built
        using api's provided by the auth helper library, or with the EdgeDB's
        Builtin login UI.
      </p>

      {#if params.error || params.info}
        <div
          class={`${
            params.error
              ? "bg-rose-100 text-rose-950"
              : "bg-sky-200 text-sky-950"
          } px-4 py-3 rounded-md`}
        >
          {params.error || params.info}
        </div>
      {/if}

      <div class="flex gap-5 mt-6 items-start w-max">
        <a
          class="block rounded-lg bg-slate-50 py-3 px-5 font-medium shadow-md shrink-0 hover:bg-white hover:scale-[1.03] transition-transform"
          href="/signin"
        >
          Sign in with custom UI
        </a>
        <div class="w-min">
          <a
            class={`block rounded-lg bg-slate-50 py-3 px-5 font-medium shadow-md shrink-0 whitespace-nowrap hover:bg-white hover:scale-[1.03] transition-transform ${
              !data.builtinUIEnabled ? "opacity-60 pointer-events-none" : ""
            }`}
            href={clientAuth.getBuiltinUIUrl()}
          >
            Sign in with ✨Built-in UI✨
          </a>
          {#if !data.builtinUIEnabled}
            <div class="text-center mx-3 mt-3 text-slate-600 text-sm">
              You need to enable the built-in UI in the auth config
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</main>
