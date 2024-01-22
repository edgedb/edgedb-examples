<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  import ResendVerificationEmail from "$lib/components/auth/ResendVerificationEmail.svelte";
  import SignUpForm from "$lib/components/auth/SignUpForm.svelte";
  import { transformSearchParams } from "$lib/utils";

  export let params = transformSearchParams($page.url.searchParams);
  export let data;
  export let form;
</script>

<div class="p-8 min-w-[32rem]">
  <a href={"/"} class="text-slate-600 inline-flex gap-1 items-center mb-2">
    <Icon icon="mdi:keyboard-backspace" />
    Home
  </a>
  <h1 class="text-3xl font-semibold mb-6">Sign up</h1>

  <div class="flex gap-[5rem] w-max">
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Email+Password</h2>
      {#if params.email_verification_error}
        <div
          class="bg-rose-100 text-rose-950 px-4 py-3 rounded-md w-[22rem] flex flex-col items-start"
        >
          {params.email_verification_error}
          {#if params.verification_token}
            <ResendVerificationEmail
              error={form?.error || null}
              message={form?.message || null}
              verificationToken={Array.isArray(params.verification_token)
                ? params.verification_token[0]
                : params.verification_token}
            />
          {/if}
        </div>
      {/if}
      {#if data.providerInfo.emailPassword}
        <SignUpForm error={form?.error} message={form?.message} />
      {:else}
        <div class="text-slate-500 italic w-[14rem]">
          Email+Password provider is not enabled
        </div>
      {/if}
    </div>
  </div>
</div>
