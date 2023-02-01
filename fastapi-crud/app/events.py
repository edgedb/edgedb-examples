from __future__ import annotations

from http import HTTPStatus
from typing import List

import edgedb
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from .queries import create_event_async_edgeql as create_event_qry
from .queries import delete_event_async_edgeql as delete_event_qry
from .queries import get_event_by_name_async_edgeql as get_event_by_name_qry
from .queries import get_events_async_edgeql as get_events_qry
from .queries import update_event_async_edgeql as update_event_qry

router = APIRouter()
client = edgedb.create_async_client()


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
) -> List[get_events_qry.GetEventsResult] | get_event_by_name_qry.GetEventByNameResult:
    if not name:
        events = await get_events_qry.get_events(client)
        return events
    else:
        event = await get_event_by_name_qry.get_event_by_name(client, name=name)
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
async def post_event(event: RequestData) -> create_event_qry.CreateEventResult:
    try:
        created_event = await create_event_qry.create_event(
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
async def put_event(
    event: RequestData, current_name: str
) -> update_event_qry.UpdateEventResult:
    try:
        updated_event = await update_event_qry.update_event(
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
async def delete_event(name: str) -> delete_event_qry.DeleteEventResult:
    deleted_event = await delete_event_qry.delete_event(client, name=name)

    if not deleted_event:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail={"error": f"Delete event '{name}' failed."},
        )

    return deleted_event
