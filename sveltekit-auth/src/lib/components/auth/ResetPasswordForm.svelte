<script lang="ts">
  import SubmitButton from "./SubmitButton.svelte";
  import { enhance } from "$app/forms";

  export let error: string | undefined;
  export let resetToken: string;
</script>

<form class="flex flex-col w-[22rem]" method="post" use:enhance>
  {#if error}
    <div class="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3">
      {error}
    </div>
  {:else}
    <label for="password" class="font-medium text-sm mb-1 ml-2">
      New password
    </label>
    <input
      type="password"
      id="password"
      name="password"
      required
      class="bg-slate-50 border border-slate-200 rounded-lg mb-4 px-4 py-3 outline-sky-500 outline-2 focus:outline focus:bg-white"
    />
    <input type="hidden" name="reset_token" bind:value={resetToken} />
    <SubmitButton label="Set new password" />
  {/if}
</form>
