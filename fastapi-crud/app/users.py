from __future__ import annotations

import datetime
from typing import Iterable

import edgedb
from fastapi import APIRouter, Query
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
    users_deserialized = (
        ResponseData(name=user.name, created_at=user.created_at) for user in users
    )
    return users_deserialized


################################
# Create users
################################


@router.post("/users")
async def post_user(user: RequestData) -> ResponseData:
    (created_user,) = await client.query(
        """SELECT (INSERT User {name:=<str>$name}) {name, created_at};""",
        name=user.name,
    )

    return ResponseData(name=created_user.name, created_at=created_user.created_at)


################################
# Update users
################################


@router.put("/users")
async def put_user(user: RequestData, filter_name: str) -> Iterable[ResponseData]:
    updated_users = await client.query(
        """
        SELECT
        (UPDATE User FILTER .name=<str>$filter_name SET {name:=<str>$name})
        {name, created_at};
        """,
        name=user.name,
        filter_name=filter_name,
    )
    users_deserialized = (
        ResponseData(name=user.name, created_at=user.created_at)
        for user in updated_users
    )
    return users_deserialized


################################
# Delete users
################################


@router.delete("/users")
async def delete_user(filter_name: str) -> Iterable[ResponseData]:
    deleted_users = client.query(
        """SELECT
        (DELETE User FILTER .name=<str>$filter_name) {name, created_at};
        """,
        filter_name=filter_name,
    )

    users_deserialized = (
        ResponseData(name=user.name, created_at=user.created_at)
        for user in deleted_users
    )
    return users_deserialized
