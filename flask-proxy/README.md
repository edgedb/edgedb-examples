## Demo authentication and HTTP query proxy server.

### Background

With some care it is possible to use ACLs to craft a database schema
where it is safe for untrusted client code to query the database,
provided that appropriate global variables are set that correspond to
the permissions granted to the client.

While EdgeDB ACLs can handle the question of *authorization*, EdgeDB
does not (yet!) have a way to interface with the application's
*authentication* logic.

One approach to solving this is:
 1. Run an authentication service that authenticates users and then signs
    tokens containing appropriate EdgeDB global variables for that user's
    login session.
 2. Run a proxy service that accepts EdgeDB HTTP requests (for EdgeQL,
    GraphQL, or both) and forwards them to the EdgeDB server. If a global
    variable token is provided, it is authenticated and the globals
    included in the query. (Alternately, if it is not provided, the query
    could fail.)

These services could be separate or combined.

### What this demo contains

This example demonstrates a combined authentication/proxy service.

Authentication is done via GitHub OAuth and the EdgeDB global variables
we generate simply contains the GitHub username.

There is an accompanying example schema for this in dbschema that
uses access policies to control access to user todo lists, but
the details are not really relevant to the proxy, apart from that it
has a global called cur_username.

### Setup

1. Create a [GitHub OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).
   For "Authorization callback URL", specify
   `http://<host>:<port>/authorize/github`. By default, in dev mode,
   this will be `http://localhost:5000/authorize/github`.

2. Configure the server. It can be configured by editing the source code
   or by running the server with the `EDGEDB_PROXY_SETTINGS` environment
   variable set to the path of a config file listing the configuration
   variables (with python syntax).

  Some of the variables:
   * `SECRET_KEY` -- the secret key that flask will use to sign tokens.
     Can be generated in python with `secrets.token_hex(32)`
   * `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` -- the client
     ID and secret created with the github app.
   * `EDGEDB_SERVER` -- URL for the edgedb server. Note that we don't
     do any authentication for the HTTP endpoints, so make sure that
     it isn't exposed to anything but your application servers!
