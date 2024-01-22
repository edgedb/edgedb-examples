<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Todo } from "./types.js";
  import TodoCard from "./TodoCard.svelte";
  import { enhance } from "$app/forms";

  let newItem = "";

  export let todos: Todo[] | null;
</script>

<div class="flex flex-col gap-3 mt-4">
  <form
    class="flex bg-slate-50 border border-slate-200 rounded-xl mb-4 overflow-hidden outline-teal-600 outline-[3px] focus-within:outline focus-within:bg-white"
    method="post"
    action="?/addTodo"
    use:enhance
  >
    <input
      type="text"
      name="newTodo"
      placeholder="Add new todo..."
      bind:value={newItem}
      class="flex-grow bg-transparent pl-5 text-lg focus:outline-none focus-visible:ring-0"
    />
    <button
      type="submit"
      class="h-9 w-9 p-3 box-content flex items-center justify-center text-teal-600"
      tabIndex={-1}
    >
      <Icon icon="mdi:send" />
    </button>
  </form>
  {#if todos?.length}
    {#each todos as todo (todo.id)}
      <TodoCard {...todo}></TodoCard>
    {/each}
  {:else}
    <div
      class="border-dashed border-2 border-slate-300 text-slate-500 h-8 py-4 px-8 box-content flex items-center rounded-xl"
    >
      You have no todo's
    </div>
  {/if}
</div>
