import edgedb
from fastapi import Request


def get_edgedb_client(request: Request) -> edgedb.AsyncIOClient:
    return request.app.state.edgedb
