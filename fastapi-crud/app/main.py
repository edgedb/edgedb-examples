from __future__ import annotations

import edgedb
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app import events, users

fast_api = FastAPI()


@fast_api.on_event("startup")
async def setup_edgedb():
    client = fast_api.state.edgedb = edgedb.create_async_client()
    await client.ensure_connected()


@fast_api.on_event("shutdown")
async def shutdown_edgedb():
    client, fast_api.state.edgedb = fast_api.state.edgedb, None
    await client.aclose()


@fast_api.get("/health_check", include_in_schema=False)
async def health_check() -> dict[str, str]:
    return {"status": "Ok"}


# Set all CORS enabled origins
fast_api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


fast_api.include_router(events.router)
fast_api.include_router(users.router)
