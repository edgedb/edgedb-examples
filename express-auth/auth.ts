import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import createExpressAuth, {
  type AuthRequest,
  type CallbackRequest,
  type ExpressAuthSession,
} from "@edgedb/auth-express";
import { client } from "./db.js";

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

/************
 * Sign Out *
 ************/

export const signoutRoute = Router().get(
  "/",
  auth.signout,
  async (_: AuthRequest, res: Response) => {
    res.redirect("/");
  }
);

/***************
 * Built-in UI *
 ***************/

const builtinCallback = async (req: CallbackRequest, res: Response) => {
  if (req.isSignUp) {
    return res.redirect("/onboarding");
  }

  res.redirect("/");
};

export const factoriedBuiltinUIRouter = auth.createBuiltinRouter({
  callback: [builtinCallback],
});

export const builtinUIRouter = Router()
  .get("/signin", auth.builtin.signIn)
  .get("/signup", auth.builtin.signUp)
  .get("/callback", auth.builtin.callback, builtinCallback);

/*********************************
 * Custom UI: Email and password *
 *********************************/

const emailPassword = {
  signIn: [
    async (_: AuthRequest, res: Response) => {
      res.redirect("/");
    },
    (err: any, _: Request, res: Response) => {
      console.error("/signin error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    },
  ],
  signUp: [
    async (req: AuthRequest, res: Response) => {
      if (!req.tokenData?.identity_id) {
        // Requires email validation
        return res.redirect(
          `/signin?error=${encodeURIComponent(
            "Check your email for verification instructions."
          )}`
        );
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
    (err: any, _: Request, res: Response) => {
      console.error("/signup error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    },
  ],
  verify: [
    async (_: AuthRequest, res: Response) => {
      res.redirect("/onboarding");
    },
    (err: any, _: Request, res: Response) => {
      console.error("/verify error: ", err);
      res.redirect(`/verify?error=${encodeURIComponent(err.message)}`);
    },
  ],
  resendVerificationEmail: [
    async (_: AuthRequest, res: Response) => {
      res.redirect("/signin");
    },
    async (err: any, _: Request, res: Response) => {
      console.error("/resent-verification-email error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    },
  ],
  resetPassword: [
    async (_: AuthRequest, res: Response) => {
      res.redirect("/");
    },
    async (err: any, _: Request, res: Response) => {
      console.error("/reset-password error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    },
  ],
  sendPasswordResetEmail: [
    async (_: AuthRequest, res: Response) => {
      res.redirect("/signin");
    },
    (err: any, _: Request, res: Response) => {
      console.error("/send-password-reset-email error: ", err);
      res.redirect(`/signin?error=${encodeURIComponent(err.message)}`);
    },
  ],
};

export const factoriedEmailPasswordRouter = auth.createEmailPasswordRouter(
  "/auth",
  "/reset-password",
  emailPassword
);

export const emailPasswordRouter = Router()
  .post("/signin", auth.emailPassword.signIn, ...emailPassword.signIn)
  .post(
    "/signup",
    auth.emailPassword.signUp("http://localhost:3333/auth/verify"),
    ...emailPassword.signUp
  )
  .get("/verify", auth.emailPassword.verify, ...emailPassword.verify)
  .post(
    "/send-password-reset-email",
    auth.emailPassword.sendPasswordResetEmail(
      "http://localhost:3333/auth/reset-password"
    ),
    ...emailPassword.sendPasswordResetEmail
  )
  .post(
    "/reset-password",
    auth.emailPassword.resetPassword,
    ...emailPassword.resetPassword
  )
  .post(
    "/resend-verification-email",
    auth.emailPassword.resendVerificationEmail,
    ...emailPassword.resendVerificationEmail
  );

/********************
 * Custom UI: OAuth *
 ********************/

const oAuthCallback = (req: CallbackRequest, res: Response) => {
  if (req.isSignUp) {
    return res.redirect("/onboarding");
  }

  res.redirect("/");
};

export const factoriedOAuthRouter = auth.createOAuthRouter("/auth/oauth", {
  callback: [oAuthCallback],
});

export const oAuthRouter = Router()
  .get("/", auth.oAuth.redirect("http://localhost:3333/auth/oauth/callback"))
  .get("/callback", auth.oAuth.callback, oAuthCallback);
