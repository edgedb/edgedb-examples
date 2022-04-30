from __future__ import annotations

import secrets
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from strawberry.fastapi import GraphQLRouter

from app.schema import schema

app = FastAPI()
router = GraphQLRouter(schema)
security = HTTPBasic()


def auth(credentials: HTTPBasicCredentials = Depends(security)) -> Literal[True]:
    """Simple HTTP Basic Auth."""
    
    correct_username = secrets.compare_digest(credentials.username, "ubuntu")
    correct_password = secrets.compare_digest(credentials.password, "debian")

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return True


@router.api_route("/", methods=["GET", "POST"])
async def graphql(request: Request):
    return await router.handle_graphql(request=request)


app.include_router(router, prefix="/graphql", dependencies=[Depends(auth)])
