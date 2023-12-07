import express from "express";
import cookieParser from "cookie-parser";
import { AuthRequest } from "@edgedb/auth-express/src";

import { styles } from "./styles";
import { auth, requireAuth, authEmailPasswordRouter } from "./auth";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(auth.createSessionMiddleware());

app.use("/auth", authEmailPasswordRouter);

const pageTemplate = (body: string) => `
<html>
  <head>
    <style>
${styles}
    </style>
  </head>
  <body>
    <main>
${body}
    </main>
  </body>
</html>
`;

app.get("/onboarding", requireAuth, (req, res) => {
  res.send(
    pageTemplate(`
    <h1>Onboarding</h1>
    <a href="/auth/signout">Sign out</a>
  `)
  );
});

app.get("/dashboard", requireAuth, (req, res) => {
  res.send(
    pageTemplate(`
    <h1>Dashboard</h1>
    <a href="/auth/signout">Sign out</a>
  `)
  );
});

app.get("/verify", (req, res) => {
  res.send(
    pageTemplate(`
    <p>Check your email for a verification message.</p>
  `)
  );
});

app.get("/signin", (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const errors = url.searchParams.getAll("error");
  const errorMessages = errors.map((error) => `<p class="error">${error}</p>`);

  res.send(
    pageTemplate(`
    <h1>Welcome!</h1>
    <div class="errors">
      ${errorMessages.join("")}
    </div>
    <form method="POST" action="/auth/signin">
      <div class="form-control">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="email@example.com" autofocus />
      </div>
      <div class="form-control">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" />
      </div>
      <div class="actions">
        <button type="submit">Sign In</button>
        <button type="submit" formaction="/auth/signup">Sign Up</button>
      </div>
    </form>
    <a href="/forgot-password">Forgot your password?</a>
  `)
  );
});

app.get("/forgot-password", (req, res) => {
  res.send(
    pageTemplate(`
    <h1>Forgot Password</h1>
    <form method="POST" action="/auth/send-password-reset-email">
      <div class="form-control">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="email@example.com" autofocus />
      </div>
      <div class="actions">
        <button type="submit">Send Password Reset Email</button>
        <a href="/signin">Cancel</a>
      </div>
    </form>
  `)
  );
});

app.get("/", async (req: AuthRequest, res) => {
  if (await req.session?.isLoggedIn()) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/signin");
  }
});

app.listen(3333, () => {
  console.log("Listening on http://localhost:3333");
});
