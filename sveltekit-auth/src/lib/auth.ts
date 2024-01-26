import createEdgedbClientAuth, {
  type AuthOptions,
} from "@edgedb/auth-sveltekit/client";

export const options: AuthOptions = {
  baseUrl: "http://localhost:5173",
  passwordResetPath: "/reset-password",
};

const auth = createEdgedbClientAuth(options);

export default auth;
