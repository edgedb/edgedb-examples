"""Demo authorization and HTTP query proxy server.

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
    GraphQL or both) and forwards them to the EdgeDB server. If a global
    variable token is provided, it is authenticated and the globals
    included in the query. (Alternately, if it is not provided, the query
    could fail.)

These services could be separate or combined.

In this demo, the services are combined. Authentication is done via
GitHub OAuth, and that username is provided as a global variable.

There is an accompanying example schema for this in dbschema that
uses access policies to control access to user todo lists, but
the details are not really relevant to the proxy, apart from that it
has a global called cur_username.
"""

from __future__ import annotations

from http import HTTPStatus

import jwt
import requests
from authlib.integrations.flask_client import OAuth
from flask import Flask, redirect, request, url_for

app = Flask(__name__)
default_config = {
    "EDGEDB_SERVER": "http://127.0.0.1:5656",
    "EDGEDB_DB": "edgedb",
    "SECRET_KEY": "<a secret key for signing tokens>",
    "GITHUB_CLIENT_ID": "<github oauth client id>",
    "GITHUB_CLIENT_SECRET": "<github oauth client secret>",
}
app.config.update(default_config)
app.config.from_envvar("EDGEDB_PROXY_SETTINGS")


@app.route("/")
def static_file():
    return app.send_static_file("index.html")


def do_query(
    url: str,
    query: str,
    *,
    variables: dict[str, object] = None,
    globals: dict[str, object] = None,
) -> str:
    req_data: dict[str, object] = {"query": query}
    if variables is not None:
        req_data["variables"] = variables
    if globals is not None:
        req_data["globals"] = globals

    response = requests.post(url, json=req_data)
    return response.text


def query_url(server: str, db: str, lang: str) -> str:
    return f"{server}/db/{db}/{lang}"


def _query(lang: str | None, query: str | None, variables: dict[str, object] = None):
    """Common implementation of the query proxy endpoints"""
    if lang not in ("edgeql", "graphql"):
        return {"status": "Invalid lang"}, HTTPStatus.BAD_REQUEST
    if not isinstance(query, str):
        return {"status": "Invalid query"}, HTTPStatus.BAD_REQUEST

    globals = default_globals()
    # If there is a JWT token cookie, decode it and grab out any global variable values
    # NOTE: Could choose to reject unauthenticated, also
    if token := request.cookies.get("token"):
        uglob = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        globals.update(uglob)

    server_url = query_url(app.config["EDGEDB_SERVER"], app.config["EDGEDB_DB"], lang)
    resp = do_query(server_url, query, variables=variables, globals=globals)

    return resp, HTTPStatus.OK, {"Content-Type": "application/json"}


@app.route("/query", methods=["POST"])
def query():
    """Simple endpoint for html form POSTs"""
    lang = request.form.get("lang")
    query = request.form.get("query")
    return _query(lang, query)


@app.route("/query/<lang>", methods=["POST"])
def query_json(lang: str):
    """API style endpoint"""
    query = request.json.get("query")
    variables = request.json.get("variables")
    return _query(lang, query, variables)


# NOTE: app specific
def default_globals() -> dict[str, object]:
    return {}


# NOTE: app specific
def globals_from_github_profile(profile: dict[str, str]) -> dict[str, object]:
    username = profile["login"]
    # NOTE: A real app likely also wants to actually check that this
    # corresponds to a real account in the app.
    return {"default::cur_username": username}


oauth = OAuth(app)
oauth.register(
    name="github",
    access_token_url="https://github.com/login/oauth/access_token",
    access_token_params=None,
    authorize_url="https://github.com/login/oauth/authorize",
    authorize_params=None,
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)


@app.route("/login/github")
def login_github():
    redirect_uri = url_for("authorize_github", _external=True)
    return oauth.github.authorize_redirect(redirect_uri)


@app.route("/authorize/github")
def authorize_github():
    token = oauth.github.authorize_access_token()
    resp = oauth.github.get("user", token=token)
    resp.raise_for_status()

    globals = globals_from_github_profile(resp.json())

    # TODO: Expiration?
    encoded_jwt = jwt.encode(globals, app.config["SECRET_KEY"], algorithm="HS256")

    # Set the encoded jwt as a cookie
    resp = redirect("/")
    resp.set_cookie("token", encoded_jwt)
    return resp
