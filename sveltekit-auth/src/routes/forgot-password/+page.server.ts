import auth from "$lib/server/auth";
import { fail, type Actions } from "@sveltejs/kit";

export const load = async () => ({
  providers: await auth.getProvidersInfo(),
});

export const actions = {
  default: async ({ request, cookies }) => {
    return auth.emailPasswordSendPasswordResetEmail(
      request.clone(),
      cookies,
      async ({ error }) => {
        if (error) {
          return fail(400, { error: error?.message });
        } else {
          const email = (await request.formData()).get("email")!.toString();

          return {
            message: `Password reset email has been sent to '${email}'`,
          };
        }
      }
    );
  },
} satisfies Actions;
