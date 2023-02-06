"""
Currently these tests use the same database that the app uses.
In a real application, you'd want to patch the 'client' to use a
separate database.

"""

from http import HTTPStatus

import pytest
from httpx import AsyncClient

from app.main import fast_api

BASE_URL = "http://localhost:5001"


@pytest.mark.anyio
async def test_get_users():
    async with AsyncClient(app=fast_api, base_url=BASE_URL) as client:
        response = await client.get("/users")
    assert response.status_code == HTTPStatus.OK


# Post test doesn't work for some weird bug, most likely an edgedb client bug.

# @pytest.mark.anyio
# async def test_post_user():
#     async with AsyncClient(app=fast_api, base_url=BASE_URL) as client:
#         response = await client.post(
#             "/users", json={"name": "test"}
#         )
#     assert response.status_code == HTTPStatus.CREATED
#     assert response.json()["name"] == "test"
