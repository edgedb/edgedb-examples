"""
Currently these tests use the same database that the app uses.
In a real application, you'd want to patch the 'client' to use a
separate database.

"""

from http import HTTPStatus

from httpx import AsyncClient

from app.main import fast_api

BASE_URL = "http://localhost:5000"


async def test_get_events():
    async with AsyncClient(app=fast_api, base_url=BASE_URL) as client:
        response = await client.get("/events")
    assert response.status_code == HTTPStatus.OK
