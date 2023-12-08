import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import createExpressAuth, {
  AuthRequest,
  ExpressAuthSession,
} from "@edgedb/auth-express";
import { client } from "./db";

export const auth = createExpressAuth(client, {
  baseUrl: "http://localhost:3333",
});

export const requireAuth = async (
  req: AuthRequest,
  res: Response<any, { session?: ExpressAuthSession }>,
  next: NextFunction
) => {
  if (!(await req.session?.isSignedIn())) {
    res.redirect("/signin");
  } else {
    next();
  }
};

export const logoutRoute = Router().get(
  "/",
  auth.signout,
  async (_: AuthRequest, res: Response, __: NextFunction) => {
    res.redirect("/");
  }
);

export const configuredEmailPasswordRouter = auth.createEmailPasswordRouter(
  "/auth",
  {
    signIn: [
      async (_: AuthRequest, res: Response, __: NextFunction) => {
        res.redirect("/");
      },
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("/signin error: ", err);
        res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
      },
    ],
    signUp: [
      async (req: AuthRequest, res: Response, __: NextFunction) => {
        if (!req.tokenData?.identity_id) {
          throw new Error("Not logged in");
        }

        await client.query(
          `insert User {
          identity := assert_exists(assert_single(
            (select ext::auth::Identity filter .id = <uuid>$identity_id)
          ))
        }`,
          { identity_id: req.tokenData.identity_id }
        );
        res.redirect("/onboarding");
      },
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("/signup error: ", err);
        res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
      },
    ],
    verify: [
      async (_: AuthRequest, res: Response, __: NextFunction) => {
        res.redirect("/onboarding");
      },
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("/verify error: ", err);
        res.redirect(`/verify?error=${encodeURIComponent(err.message)}`);
      },
    ],
    resendVerificationEmail: [
      async (_: AuthRequest, res: Response, __: NextFunction) => {
        res.redirect("/signin");
      },
      async (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("/resent-verification-email error: ", err);
        res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
      },
    ],
    resetPassword: [
      async (_: AuthRequest, res: Response, __: NextFunction) => {
        res.redirect("/");
      },
      async (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("/reset-password error: ", err);
        res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
      },
    ],
    sendPasswordResetEmail: [
      async (_: AuthRequest, res: Response, __: NextFunction) => {
        res.redirect("/signin");
      },
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error("/send-password-reset-email error: ", err);
        res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
      },
    ],
  }
);

export const authEmailPasswordRouter = Router()
  .post(
    "/signin",
    auth.emailPassword.signIn,
    async (_: AuthRequest, res: Response, __: NextFunction) => {
      res.redirect("/");
    },
    (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("/signin error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    }
  )
  .post(
    "/signup",
    auth.emailPassword.signUp("http://localhost:3333/auth/verify"),
    async (req: AuthRequest, res: Response, __: NextFunction) => {
      if (!req.tokenData?.identity_id) {
        throw new Error("Not logged in");
      }

      await client.query(
        `insert User {
          identity := assert_exists(assert_single(
            (select ext::auth::Identity filter .id = <uuid>$identity_id)
          ))
        }`,
        { identity_id: req.tokenData.identity_id }
      );
      res.redirect("/onboarding");
    },
    (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("/signup error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    }
  )
  .get(
    "/verify",
    auth.emailPassword.verify,
    async (_: AuthRequest, res: Response, __: NextFunction) => {
      res.redirect("/onboarding");
    },
    (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("/verify error: ", err);
      res.redirect(`/verify?error=${encodeURIComponent(err.message)}`);
    }
  )
  .post(
    "/send-password-reset-email",
    auth.emailPassword.sendPasswordResetEmail(
      "http://localhost:3333/auth/reset-password"
    ),
    async (_: AuthRequest, res: Response, __: NextFunction) => {
      res.redirect("/signin");
    },
    (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("/send-password-reset-email error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    }
  )
  .post(
    "/reset-password",
    auth.emailPassword.resetPassword,
    async (_: AuthRequest, res: Response, __: NextFunction) => {
      res.redirect("/");
    },
    async (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("/reset-password error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    }
  )
  .post(
    "/resend-verification-email",
    auth.emailPassword.resendVerificationEmail,
    async (_: AuthRequest, res: Response, __: NextFunction) => {
      res.redirect("/signin");
    },
    async (err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("/resent-verification-email error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    }
  );
