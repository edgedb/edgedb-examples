<script>
  import Icon from "@iconify/svelte";
  import ForgotPasswordForm from "$lib/components/auth/ForgotPasswordForm.svelte";

  export let data;
  export let form;
</script>

<div class="p-8 min-w-[32rem]">
  <a href={"/"} class="text-slate-600 inline-flex gap-1 items-center mb-2">
    <Icon icon="mdi:keyboard-backspace" />
    Home
  </a>
  <h1 class="text-3xl font-semibold mb-6">Email+Password</h1>

  <div class="flex gap-[5rem] w-max">
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Send password reset email</h2>
      {#if data.providers.emailPassword}
        <ForgotPasswordForm
          error={form?.error || null}
          message={form?.message || null}
        />
      {:else}
        <div class="text-slate-500 italic w-[14rem]">
          Email+Password provider is not enabled
        </div>
      {/if}
    </div>
  </div>
</div>
