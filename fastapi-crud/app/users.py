from __future__ import annotations

import datetime
from http import HTTPStatus
from typing import Iterable

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

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
async def get_users(name: str = Query(None, max_length=50)) -> Iterable[ResponseData]:

    if not name:
        users = await client.query("SELECT User {name, created_at};")
    else:
        users = await client.query(
            """SELECT User {name, created_at} FILTER User.name=<str>$name""",
            name=name,
        )
    response = (
        ResponseData(name=user.name, created_at=user.created_at) for user in users
    )
    return response


################################
# Create users
################################


@router.post("/users", status_code=HTTPStatus.CREATED)
async def post_user(user: RequestData) -> ResponseData:

    try:
        (created_user,) = await client.query(
            """SELECT (INSERT User {name:=<str>$name}) {name, created_at};""",
            name=user.name,
        )
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
async def put_user(user: RequestData, filter_name: str) -> Iterable[ResponseData]:
    try:
        updated_users = await client.query(
            """
            SELECT (
                UPDATE User FILTER .name=<str>$filter_name
                SET {name:=<str>$name}
            ) {name, created_at};
            """,
            name=user.name,
            filter_name=filter_name,
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Username '{filter_name}' already exists."},
        )

    response = (
        ResponseData(name=user.name, created_at=user.created_at)
        for user in updated_users
    )
    return response


################################
# Delete users
################################


@router.delete("/users")
async def delete_user(name: str) -> Iterable[ResponseData]:
    try:
        deleted_users = await client.query(
            """SELECT (
                DELETE User FILTER .name=<str>$name
            ) {name, created_at};
            """,
            name=name,
        )
    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": "User attached to an event. Cannot delete."},
        )

    response = (
        ResponseData(name=deleted_user.name, created_at=deleted_user.created_at)
        for deleted_user in deleted_users
    )

    return response
