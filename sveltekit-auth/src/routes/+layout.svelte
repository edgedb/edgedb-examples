<script>
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";
  import "../app.css";

  $: isHomepage = $page.route.id === "/";
</script>

<main class="w-screen h-screen flex items-center justify-center">
  <div class="p-8 min-w-[32rem]">
    {#if !isHomepage}
      <a href={"/"} class="text-slate-600 inline-flex gap-1 items-center mb-2">
        <Icon icon="mdi:keyboard-backspace" />
        Home
      </a>
    {/if}

    <slot />
  </div>
</main>
