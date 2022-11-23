from __future__ import annotations

import datetime
from http import HTTPStatus
from typing import Iterable

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

import generated_async_edgeql as db_queries

router = APIRouter()
client = edgedb.create_async_client()


class RequestData(BaseModel):
    name: str


class ResponseData(BaseModel):
    name: str
    created_at: datetime.datetime


################################
# Get users
################################


@router.get("/users")
async def get_users(name: str = Query(None, max_length=50)) -> Iterable[ResponseData] | ResponseData:

    if not name:
        users = await db_queries.get_users(client)
        response = (
            ResponseData(name=user.name, created_at=user.created_at) for user in users
        )
    else:
        user = await db_queries.get_user_by_name(client, name=name)
        if not user:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND, 
                detail={"error": f"Username '{name}' does not exist."},
            )
        response = ResponseData(
            name=user.name,
            created_at=user.created_at
        )
    return response


################################
# Create users
################################


@router.post("/users", status_code=HTTPStatus.CREATED)
async def post_user(user: RequestData) -> ResponseData:

    try:
        created_user = await db_queries.insert_user(client, name=user.name)
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Username '{user.name}' already exists."},
        )
    response = ResponseData(name=created_user.name, created_at=created_user.created_at)
    return response


################################
# Update users
################################


@router.put("/users")
async def put_user(user: RequestData, current_name: str) -> ResponseData:
    try:
        updated_user = await db_queries.update_user(
            client, 
            new_name=user.name,
            current_name=current_name,
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Username '{user.name}' already exists."},
        )

    if updated_user:
        response = \
            ResponseData(name=updated_user.name, created_at=updated_user.created_at)
        return response
    else:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail={"error": f"User '{user.name}' was not found."},
        )


################################
# Delete users
################################


@router.delete("/users")
async def delete_user(name: str) -> ResponseData:
    try:
        deleted_user = await db_queries.delete_users(
            client,
            name=name,
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": "User attached to an event. Cannot delete."},
        )

    if deleted_user:
        response = \
            ResponseData(name=deleted_user.name, created_at=deleted_user.created_at)
        return response
    else:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail={"error": f"User '{name}' was not found."},
        )
