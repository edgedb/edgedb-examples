import createClientAuth, {
  type SvelteAuthOptions,
} from "@edgedb/auth-svelte/client";

export const options: SvelteAuthOptions = {
  baseUrl: "http://localhost:5173",
  passwordResetPath: "/reset-password",
};

const auth = createClientAuth(options);

export default auth;
