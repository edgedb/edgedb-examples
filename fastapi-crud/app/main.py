from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app import events, users

fast_api = FastAPI()

# Set all CORS enabled origins
fast_api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# fast_api.include_router(events.router)
fast_api.include_router(users.router)
