// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { SvelteServerAuth, Client } from "@edgedb/auth-sveltekit/server";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      client: Client;
      auth: SvelteServerAuth;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
