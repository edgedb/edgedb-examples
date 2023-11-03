import http from "node:http";
import { URL } from "node:url";
import crypto from "node:crypto";

/**
 * You can get this value by running `edgedb instance credentials`.
 * Value should be: `${protocol}://${host}:${port}/db/${database}/ext/auth/
 */
const EDGEDB_AUTH_BASE_URL = process.env.EDGEDB_AUTH_BASE_URL;
const SERVER_PORT = 3000;

/**
 * Generate a random Base64 url-encoded string, and derive a "challenge"
 * string from that string to use as proof that the request for a token
 * later is made from the same user agent that made the original request
 *
 * @returns {Object} The verifier and challenge strings
 */
const generatePKCE = () => {
  const verifier = crypto.randomBytes(32).toString("base64url");

  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  return { verifier, challenge };
};

/**
 * In Node, the `req.url` is only the `pathname` portion of a URL. In order
 * to generate a full URL, we need to build the protocol and host from other
 * parts of the request.
 *
 * One reason we like to use `URL` objects here is to easily parse the
 * `URLSearchParams` from the request, and rather than do more error prone
 * string manipulation, we build a `URL`.
 *
 * @param {Request} req
 * @returns {URL}
 */
const getRequestUrl = (req) => {
  const protocol = req.connection.encrypted ? "https" : "http";
  return new URL(req.url, `${protocol}://${req.headers.host}`);
};

const server = http.createServer(async (req, res) => {
  const requestUrl = getRequestUrl(req);

  switch (requestUrl.pathname) {
    case "/auth/ui/signin": {
      await handleUiSignIn(req, res);
      break;
    }

    case "/auth/ui/signup": {
      await handleUiSignUp(req, res);
      break;
    }

    case "/auth/authorize": {
      await handleAuthorize(req, res);
      break;
    }

    case "/auth/callback": {
      await handleCallback(req, res);
      break;
    }

    case "/auth/signup": {
      await handleSignUp(req, res);
      break;
    }

    case "/auth/signin": {
      await handleSignIn(req, res);
      break;
    }

    case "/auth/verify": {
      await handleVerify(req, res);
      break;
    }

    default: {
      res.writeHead(404);
      res.end("Not found");
      break;
    }
  }
});

/**
 * Redirects browser requests to EdgeDB Auth UI sign in page with the
 * PKCE challenge, and saves PKCE verifier in an HttpOnly cookie.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleUiSignIn = async (req, res) => {
  const pkce = generatePKCE();

  const redirectUrl = new URL("ui/signin", EDGEDB_AUTH_BASE_URL);
  redirectUrl.searchParams.set("challenge", pkce.challenge);

  res.writeHead(301, {
    "Set-Cookie": `edgedb-pkce-verifier=${pkce.verifier}; HttpOnly; Path=/; Secure; SameSite=Strict`,
    Location: redirectUrl.href,
  });
  res.end();
};

/**
 * Redirects browser requests to EdgeDB Auth UI sign up page with the
 * PKCE challenge, and saves PKCE verifier in an HttpOnly cookie.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleUiSignUp = async (req, res) => {
  const pkce = generatePKCE();

  const redirectUrl = new URL("ui/signup", EDGEDB_AUTH_BASE_URL);
  redirectUrl.searchParams.set("challenge", pkce.challenge);

  res.writeHead(301, {
    "Set-Cookie": `edgedb-pkce-verifier=${pkce.verifier}; HttpOnly; Path=/; Secure; SameSite=Strict`,
    Location: redirectUrl.href,
  });
  res.end();
};

/**
 * Redirects OAuth requests to EdgeDB Auth OAuth authorize redirect
 * with the PKCE challenge, and saves PKCE verifier in an HttpOnly
 * cookie for later retrieval.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleAuthorize = async (req, res) => {
  const requestUrl = getRequestUrl(req);
  const provider = requestUrl.searchParams.get("provider");

  if (!provider) {
    res.status = 400;
    res.end("Must provider a 'provider' value in search parameters");
    return;
  }

  const pkce = generatePKCE();
  const redirectUrl = new URL("authorize", EDGEDB_AUTH_BASE_URL);
  redirectUrl.searchParams.set("provider", provider);
  redirectUrl.searchParams.set("challenge", pkce.challenge);
  redirectUrl.searchParams.set(
    "redirect_to",
    `http://localhost:${SERVER_PORT}/auth/callack`,
  );

  res.writeHead(301, {
    "Set-Cookie": `edgedb-pkce-verifier=${pkce.verifier}; HttpOnly; Path=/; Secure; SameSite=Strict`,
    Location: redirectUrl.href,
  });
  res.end();
};

/**
 * Handles the PKCE callback and exchanges the `code` and `verifier
 * for an auth_token, setting the auth_token as an HttpOnly cookie.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleCallback = async (req, res) => {
  const requestUrl = getRequestUrl(req);

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    const error = requestUrl.searchParams.get("error");
    res.status = 400;
    res.end(
      `OAuth callback is missing 'code'. OAuth provider responded with error: ${error}`,
    );
    return;
  }

  const cookies = req.headers.cookie?.split("; ");
  const verifier = cookies
    ?.find((cookie) => cookie.startsWith("edgedb-pkce-verifier="))
    ?.split("=")[1];
  if (!verifier) {
    res.status = 400;
    res.end(
      `Could not find 'verifier' in the cookie store. Is this the same user agent/browser that started the authorization flow?`,
    );
    return;
  }

  const codeExchangeUrl = new URL("token", EDGEDB_AUTH_BASE_URL);
  codeExchangeUrl.searchParams.set("code", code);
  codeExchangeUrl.searchParams.set("verifier", verifier);
  const codeExchangeResponse = await fetch(codeExchangeUrl.href, {
    method: "GET",
  });

  if (!codeExchangeResponse.ok) {
    const text = await codeExchangeResponse.text();
    res.status = 400;
    res.end(`Error from the auth server: ${text}`);
    return;
  }

  const { auth_token } = await codeExchangeResponse.json();
  res.writeHead(204, {
    "Set-Cookie": `edgedb-auth-token=${auth_token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
  });
  res.end();
};

/**
 * Handles sign up with email and password.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleSignUp = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const pkce = generatePKCE();
    const { email, password, provider } = JSON.parse(body);
    if (!email || !password || !provider) {
      res.status = 400;
      res.end(
        `Request body malformed. Expected JSON body with 'email', 'password', and 'provider' keys, but got: ${body}`,
      );
      return;
    }

    const registerUrl = new URL("register", EDGEDB_AUTH_BASE_URL);
    const registerResponse = await fetch(registerUrl.href, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challenge: pkce.challenge,
        email,
        password,
        provider,
        verify_url: `http://localhost:${SERVER_PORT}/auth/verify`,
      }),
    });

    if (!registerResponse.ok) {
      const text = await registerResponse.text();
      res.status = 400;
      res.end(`Error from the auth server: ${text}`);
      return;
    }

    res.writeHead(204, {
      "Set-Cookie": `edgedb-pkce-verifier=${pkce.verifier}; HttpOnly; Path=/; Secure; SameSite=Strict`,
    });
    res.end();
  });
};
/**
 * Handles sign in with email and password.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleSignIn = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const pkce = generatePKCE();
    const { email, password, provider } = JSON.parse(body);
    if (!email || !password || !provider) {
      res.status = 400;
      res.end(
        `Request body malformed. Expected JSON body with 'email', 'password', and 'provider' keys, but got: ${body}`,
      );
      return;
    }

    const authenticateUrl = new URL("authenticate", EDGEDB_AUTH_BASE_URL);
    const authenticateResponse = await fetch(authenticateUrl.href, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challenge: pkce.challenge,
        email,
        password,
        provider,
      }),
    });

    if (!authenticateResponse.ok) {
      const text = await authenticateResponse.text();
      res.status = 400;
      res.end(`Error from the auth server: ${text}`);
      return;
    }

    const { code } = await authenticateResponse.json();

    const tokenUrl = new URL("token", EDGEDB_AUTH_BASE_URL);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("verifier", pkce.verifier);
    const tokenResponse = await fetch(tokenUrl.href, {
      method: "get",
    });

    if (!tokenResponse.ok) {
      const text = await authenticateResponse.text();
      res.status = 400;
      res.end(`Error from the auth server: ${text}`);
      return;
    }

    const { auth_token } = await tokenResponse.json();
    res.writeHead(204, {
      "Set-Cookie": `edgedb-auth-token=${auth_token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
    });
    res.end();
  });
};

/**
 * Handles the link in the email verification flow.
 *
 * @param {Request} req
 * @param {Response} res
 */
const handleVerify = async (req, res) => {
  const requestUrl = getRequestUrl(req);
  const verification_token = requestUrl.searchParams.get("verification_token");
  if (!verification_token) {
    res.status = 400;
    res.end(
      `Verify request is missing 'verification_token' search param. The verification email is malformed.`,
    );
    return;
  }

  const cookies = req.headers.cookie?.split("; ");
  const verifier = cookies
    ?.find((cookie) => cookie.startsWith("edgedb-pkce-verifier="))
    ?.split("=")[1];
  if (!verifier) {
    res.status = 400;
    res.end(
      `Could not find 'verifier' in the cookie store. Is this the same user agent/browser that started the authorization flow?`,
    );
    return;
  }

  const verifyUrl = new URL("verify", EDGEDB_AUTH_BASE_URL);
  const verifyResponse = await fetch(verifyUrl.href, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      verification_token,
      verifier,
      provider: "builtin::local_emailpassword",
    }),
  });

  if (!verifyResponse.ok) {
    const text = await verifyResponse.text();
    res.status = 400;
    res.end(`Error from the auth server: ${text}`);
    return;
  }

  const { code } = await verifyResponse.json();

  const tokenUrl = new URL("token", EDGEDB_AUTH_BASE_URL);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("verifier", verifier);
  const tokenResponse = await fetch(tokenUrl.href, {
    method: "get",
  });

  if (!tokenResponse.ok) {
    const text = await tokenResponse.text();
    res.status = 400;
    res.end(`Error from the auth server: ${text}`);
    return;
  }

  const { auth_token } = await tokenResponse.json();
  res.writeHead(204, {
    "Set-Cookie": `edgedb-auth-token=${auth_token}; HttpOnly; Path=/; Secure; SameSite=Strict`,
  });
  res.end();
};

server.listen(SERVER_PORT, () => {
  console.log(`HTTP server listening on port ${SERVER_PORT}...`);
});
