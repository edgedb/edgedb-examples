<script>
  import ResetPasswordForm from "$lib/components/auth/ResetPasswordForm.svelte";

  export let data;
  export let form;
</script>

<h1 class="text-3xl font-semibold mb-6">Email+Password</h1>
<div class="flex gap-[5rem] w-max">
  <div class="flex flex-col gap-4">
    <h2 class="text-xl font-semibold">Reset password</h2>
    {#if data.providers.emailPassword}
      {#if data.resetToken && data.isTokenValid}
        <ResetPasswordForm error={form?.error} resetToken={data.resetToken} />
      {:else}
        <div
          class="bg-rose-100 text-rose-950 px-4 py-3 rounded-md mb-3 w-[22rem]"
        >
          Reset token is invalid, it may have expired.{" "}
          <a href="/forgot-password" class="text-sky-600">
            Try sending another reset email
          </a>
        </div>
      {/if}
    {:else}
      <div class="text-slate-500 italic w-[14rem]">
        Email+Password provider is not enabled
      </div>
    {/if}
  </div>
</div>
