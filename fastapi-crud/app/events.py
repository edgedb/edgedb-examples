from __future__ import annotations

from http import HTTPStatus
from typing import Iterable

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

import generated_async_edgeql as db_queries

router = APIRouter()
client = edgedb.create_async_client()

EventResult = db_queries.CreateEventResult


class RequestData(BaseModel):
    name: str
    address: str
    schedule: str
    host_name: str


################################
# Get events
################################


@router.get("/events")
async def get_events(
    name: str = Query(None, max_length=50)
) -> Iterable[EventResult] | EventResult:
    if not name:
        events = await db_queries.get_events(client)
        return events
    else:
        event = await db_queries.get_event_by_name(client, name=name)
        if not event:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail={"error": f"Event '{name}' does not exist."},
            )
        return event


# ################################
# Create events
# ################################


@router.post("/events", status_code=HTTPStatus.CREATED)
async def post_event(event: RequestData) -> EventResult:
    try:
        created_event = await db_queries.create_event(
            client,
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
                "Datetime string must look like this: "
                "'2010-12-27T23:59:59-07:00'",
            },
        )

    except edgedb.errors.ConstraintViolationError:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"Event name '{event.name}' already exists,",
        )

    return created_event


# ################################
# Update events
# ################################


@router.put("/events")
async def put_event(event: RequestData, current_name: str) -> EventResult:

    try:
        updated_event = await db_queries.update_event(
            client,
            current_name=current_name,
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
            detail={"error": f"Event name '{event.name}' already exists."},
        )

    if not updated_event:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail={"error": f"Update event '{event.name}' failed."},
        )

    return updated_event


# ################################
# Delete events
# ################################


@router.delete("/events")
async def delete_event(name: str) -> EventResult:
    deleted_event = await db_queries.delete_event(client, name=name)

    if not deleted_event:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail={"error": f"Delete event '{name}' failed."},
        )

    return deleted_event
