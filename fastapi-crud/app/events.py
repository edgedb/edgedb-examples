from __future__ import annotations

import datetime
from http import HTTPStatus
from typing import Iterable, Optional

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

import generated_async_edgeql as db_queries

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
    address: Optional[str]
    schedule: Optional[datetime.datetime]
    host: Optional[Host]


################################
# Get events
################################


@router.get("/events")
async def get_events(
    name: str = Query(None, max_length=50)
) -> Iterable[ResponseData] | ResponseData:
    if not name:
        events = await db_queries.get_events(client)
        response = (
            ResponseData(
                name=event.name,
                address=event.address,
                schedule=event.schedule,
                host=Host(name=event.host.name if event.host else None),
            )
            for event in events
        )
    else:
        event = await db_queries.get_event_by_name(client, name=name)
        if not event:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail={"error": f"Event '{name}' does not exist."},
            )
        response = ResponseData(
            name=event.name,
            address=event.address,
            schedule=event.schedule,
            host=Host(name=event.host.name if event.host else None),
        )
    return response


# ################################
# Create events
# ################################


@router.post("/events", status_code=HTTPStatus.CREATED)
async def post_event(event: RequestData) -> ResponseData:
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
async def put_event(event: RequestData, current_name: str) -> ResponseData:

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

    if updated_event:
        response = ResponseData(
            name=updated_event.name,
            address=updated_event.address,
            schedule=updated_event.schedule,
            host=Host(name=updated_event.host.name) if updated_event.host else None,
        )
        return response
    else:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail={"error": f"Update event '{event.name}' failed."},
        )


# ################################
# Delete events
# ################################


@router.delete("/events")
async def delete_event(name: str) -> ResponseData:
    deleted_event = await db_queries.delete_event(client, name=name)

    if deleted_event:
        response = ResponseData(
            name=deleted_event.name,
            address=deleted_event.address,
            schedule=deleted_event.schedule,
            host=Host(name=deleted_event.host.name) if deleted_event.host else None,
        )
        return response
    else:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail={"error": f"Delete event '{name}' failed."},
        )
