<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";

  export let id: string;
  export let completed: boolean;
  export let content: string;
</script>

<div
  class="bg-white shadow-sm rounded-xl p-4 text-lg flex hover:scale-[1.02] transition-transform duration-75"
>
  <form method="post" action="?/updateTodo" use:enhance>
    <input
      type="hidden"
      name="todo"
      value={JSON.stringify({ id, completed })}
    />
    <button
      type="submit"
      class={`w-9 h-9 rounded-full mr-4 flex-shrink-0 flex items-center justify-center cursor-pointer ${
        completed ? "bg-sky-400 text-white" : "border border-slate-400"
      }`}
    >
      {#if completed}
        <Icon icon="mdi:check" />
      {/if}
    </button>
  </form>

  <span
    class={`flex-shrink overflow-hidden break-words py-1 mr-auto ${
      completed ? "line-through opacity-70" : ""
    }`}
  >
    {content}
  </span>

  <form method="post" action="?/deleteTodo" use:enhance>
    <input type="hidden" name="id" value={id} />
    <button
      type="submit"
      class="w-9 h-9 rounded-full ml-4 flex-shrink-0 flex items-center justify-center cursor-pointer text-slate-400 hover:bg-rose-500 hover:text-white"
    >
      <Icon icon="mdi:delete" />
    </button>
  </form>
</div>
