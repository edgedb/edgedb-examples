# Express with EdgeDB Auth

- `builtin.ts` shows how to use the built-in UI using the route factory method.
- `custom.ts` shows how to build your own UI using the manual router method.

## Setup

1. Run `edgedb project init`and follow the prompts
2. Run `npm install`
3. Run `edgedb ui`
4. Switch to the "Auth Admin" section (nested shield icon in the left-hand toolbar)
5. Enter a value for `auth_signing_key` or click the button nested in the field to generate one and click the "Update" button
6. Enter `http://localhost:3333/` in the `allowed_redirect_urls` field and click "Update"
7. Switch to the "Providers" tab
8. Click "Add Provider," select and configure a provider, and click "Add Provider" to save the new provider
9. Set the value for `redirect_to` to `http://localhost:3333/auth/callback` and click "Update"
10. (Built-in only) Click "Enable" under "Login UI"

> Note: If you configured the "Email + Password" provider to require verification, the example app will need a way to send emails. You might try running Mailpit to do this for local testing. We share how [in our EdgeDB Auth guide](https://www.edgedb.com/docs/guides/auth/index#email-and-password).

## Usage

```bash
npm run builtin
# or
npm run custom