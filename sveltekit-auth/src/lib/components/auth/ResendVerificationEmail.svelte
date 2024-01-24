<script lang="ts">
  import { enhance } from "$app/forms";

  export let verificationToken: string;
  export let error: string | undefined;
  export let message: string | undefined;
</script>

<form method="post" action="?/resendVerEmail" use:enhance>
  {#if error || message}
    <div
      class={`${
        error ? "bg-rose-100 text-rose-950" : "bg-sky-200 text-sky-950"
      } px-4 py-3 rounded-md mb-3`}
    >
      {error || message}
    </div>
  {/if}

  <input
    type="hidden"
    name="verification_token"
    bind:value={verificationToken}
  />
  <button
    name="action"
    value="resendVerEmail"
    type="submit"
    class="text-sky-600 mt-2"
  >
    Resend verification email
  </button>
</form>
