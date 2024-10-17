import secrets
import hashlib
import base64
import os

import edgedb
import httpx

from fastapi import APIRouter, HTTPException, Request, Cookie, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .queries import create_user_async_edgeql as create_user_qry

router = APIRouter()

client = edgedb.create_async_client()

class RequestData(BaseModel):
    name: str
    
EDGEDB_AUTH_BASE_URL = os.getenv("EDGEDB_AUTH_BASE_URL")

@router.post("/auth/signup")
async def handle_signup(request: Request):
    body = await request.json()
    email = body.get("email")
    name = body.get("name")
    password = body.get("password")

    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="Missing email, password, or name.")

    verifier, challenge = generate_pkce()
    register_url = f"{EDGEDB_AUTH_BASE_URL}/register"
    register_response = httpx.post(register_url, json={
        "challenge": challenge,
        "email": email,
        "password": password,
        "provider": "builtin::local_emailpassword",
        "verify_url": "http://localhost:8000/auth/verify",
    })

    if register_response.status_code != 200 and response.status_code != 201:
        return JSONResponse(status_code=400, content={"message": "Registration failed"})
    
    code = register_response.json().get("code")
    token_url = f"{EDGEDB_AUTH_BASE_URL}/token"
    token_response = httpx.get(token_url, params={"code": code, "verifier": verifier})

    if token_response.status_code != 200:
        return JSONResponse(status_code=400, content={"message": "Token exchange failed"})
    
    auth_token = token_response.json().get("auth_token")
    identity_id = token_response.json().get("identity_id")
    try:
        created_user = await create_user_qry.create_user(client, name=name, identity_id=identity_id)
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=400,
            detail={"error": f"Username '{name}' already exists."},
        )

    response = JSONResponse(content={"message": "User registered"})
    response.set_cookie(key="edgedb-auth-token", value=auth_token, httponly=True, secure=True, samesite='strict')
    return response

@router.post("/auth/signin")
async def handle_signin(request: Request):
    body = await request.json()
    email = body.get("email")
    password = body.get("password")
    provider = body.get("provider")
    
    if not email or not password or not provider:
        raise HTTPException(status_code=400, detail="Missing email, password, or provider.")

    verifier, challenge = generate_pkce()
    authenticate_url = f"{EDGEDB_AUTH_BASE_URL}/authenticate"
    response = httpx.post(authenticate_url, json={
        "challenge": challenge,
        "email": email,
        "password": password,
        "provider": provider,
    })

    if response.status_code != 200:
        return JSONResponse(status_code=400, content={"message": "Authentication failed"})

    code = response.json().get("code")
    token_url = f"{EDGEDB_AUTH_BASE_URL}/token"
    token_response = httpx.get(token_url, params={"code": code, "verifier": verifier})
    
    if token_response.status_code != 200:
        return JSONResponse(status_code=400, content={"message": "Token exchange failed"})

    auth_token = token_response.json().get("auth_token")
    response = JSONResponse(content={"message": "Authentication successful"})
    response.set_cookie(key="edgedb-auth-token", value=auth_token, httponly=True, secure=True, samesite='strict')
    return response

def generate_pkce():
    verifier = secrets.token_urlsafe(32)
    challenge = hashlib.sha256(verifier.encode()).digest()
    challenge_base64 = base64.urlsafe_b64encode(challenge).decode('utf-8').rstrip('=')
    return verifier, challenge_base64

