from __future__ import annotations

import datetime
from http import HTTPStatus
from typing import Iterable, Optional

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()
client = edgedb.create_async_client()


class RequestData(BaseModel):
    name: str
    address: str
    schedule: str
    host_name: str


class Host(BaseModel):
    name: Optional[str]


class ResponseData(BaseModel):
    name: str
    address: str
    schedule: datetime.datetime
    host: Optional[Host]


################################
# Get events
################################


@router.get("/events")
async def get_events(name: str = Query(None, max_length=50)) -> Iterable[ResponseData]:
    if not name:
        events = await client.query(
            """
        SELECT Event {name, address, schedule, host : {name}};
        """
        )

    else:
        events = await client.query(
            """
            SELECT Event {
                name, address, schedule,
                host : {name}
            } FILTER .name=<str>$name
            """,
            name=name,
        )
    response = (
        ResponseData(
            name=event.name,
            address=event.address,
            schedule=event.schedule,
            host=Host(name=event.host.name if event.host else None),
        )
        for event in events
    )
    return response


# ################################
# Create events
# ################################


@router.post("/events", status_code=HTTPStatus.CREATED)
async def post_event(event: RequestData) -> ResponseData:
    try:
        (created_event,) = await client.query(
            """
            WITH name:=<str>$name, address:=<str>$address,
            schedule:=<str>$schedule, host_name:=<str>$host_name

            SELECT (
                INSERT Event {
                name:=name,
                address:=address,
                schedule:=<datetime>schedule,
                host:=assert_single((SELECT DETACHED User FILTER .name=host_name))
            }) {name, address, schedule, host: {name}};
            """,
            name=event.name,
            address=event.address,
            schedule=event.schedule,
            host_name=event.host_name,
        )

    except edgedb.errors.InvalidValueError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={
                "error": "Invalid datetime format. "
                "Datetime string must look like this: '2010-12-27T23:59:59-07:00'",
            },
        )

    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"Event name '{event.name}' already exists,",
        )

    return ResponseData(
        name=created_event.name,
        address=created_event.address,
        schedule=created_event.schedule,
        host=Host(name=created_event.host.name) if created_event.host else None,
    )


# ################################
# Update events
# ################################


@router.put("/events")
async def put_event(event: RequestData, filter_name: str) -> Iterable[ResponseData]:

    try:
        updated_events = await client.query(
            """
            WITH filter_name:=<str>$filter_name, name:=<str>$name,
            address:=<str>$address, schedule:=<str>$schedule,
            host_name:=<str>$host_name

            SELECT (
                UPDATE Event FILTER .name=filter_name
                SET {
                    name:=name, address:=address,
                    schedule:=<datetime>schedule,
                    host:=(SELECT User filter .name=host_name)
                    }
                ) {name, address, schedule, host: {name}}

            ;
            """,
            filter_name=filter_name,
            name=event.name,
            address=event.address,
            schedule=event.schedule,
            host_name=event.host_name,
        )

    except edgedb.errors.InvalidValueError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={
                "error": "Invalid datetime format. "
                "Datetime string must look like this: '2010-12-27T23:59:59-07:00'",
            },
        )

    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail={"error": f"Event name '{event.name}' already exists,"},
        )

    response = (
        ResponseData(
            name=updated_event.name,
            address=updated_event.address,
            schedule=updated_event.schedule,
            host=Host(name=updated_event.host.name) if updated_event.host else None,
        )
        for updated_event in updated_events
    )
    return response


# ################################
# Delete events
# ################################


@router.delete("/events")
async def delete_event(filter_name: str) -> Iterable[ResponseData]:
    deleted_events = await client.query(
        """
        SELECT (
            DELETE Event FILTER .name=<str>$filter_name)
            {name, address, schedule, host : {name}};
        """,
        filter_name=filter_name,
    )

    response = (
        ResponseData(
            name=deleted_event.name,
            address=deleted_event.address,
            schedule=deleted_event.schedule,
            host=Host(name=deleted_event.host.name) if deleted_event.host else None,
        )
        for deleted_event in deleted_events
    )

    return response
