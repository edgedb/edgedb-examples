from __future__ import annotations

from http import HTTPStatus
from typing import List

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from .queries import (
    create_user_async_edgeql,
    delete_user_async_edgeql,
    get_user_by_name_async_edgeql,
    get_users_async_edgeql,
    update_user_async_edgeql,
)

router = APIRouter()
client = edgedb.create_async_client()


class RequestData(BaseModel):
    name: str


################################
# Get users
################################


@router.get("/users")
async def get_users(
    name: str = Query(None, max_length=50)
) -> List[
    get_users_async_edgeql.GetUsersResult
] | get_user_by_name_async_edgeql.GetUserByNameResult:

    if not name:
        users = await get_users_async_edgeql.get_users(client)
        return users
    else:
        user = await get_user_by_name_async_edgeql.get_user_by_name(client, name=name)
        if not user:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail={"error": f"Username '{name}' does not exist."},
            )
        return user


################################
# Create users
################################


@router.post("/users", status_code=HTTPStatus.CREATED)
async def post_user(user: RequestData) -> create_user_async_edgeql.CreateUserResult:

    try:
        created_user = await create_user_async_edgeql.create_user(
            client, name=user.name
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Username '{user.name}' already exists."},
        )
    return created_user


################################
# Update users
################################


@router.put("/users")
async def put_user(
    user: RequestData, current_name: str
) -> update_user_async_edgeql.UpdateUserResult:
    try:
        updated_user = await update_user_async_edgeql.update_user(
            client,
            new_name=user.name,
            current_name=current_name,
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Username '{user.name}' already exists."},
        )

    if not updated_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail={"error": f"User '{current_name}' was not found."},
        )
    return updated_user


################################
# Delete users
################################


@router.delete("/users")
async def delete_user(name: str) -> delete_user_async_edgeql.DeleteUserResult:
    try:
        deleted_user = await delete_user_async_edgeql.delete_user(
            client,
            name=name,
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": "User attached to an event. Cannot delete."},
        )

    if not deleted_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail={"error": f"User '{name}' was not found."},
        )
    return deleted_user
