"""
Currently these tests use the same database that the app uses.
In a real application, you'd want to patch the 'client' to use a
separate database.

"""

from http import HTTPStatus

from fastapi.testclient import TestClient

from app.main import fast_api


def test_get_events():
    with TestClient(fast_api) as client:
        response = client.get("/events")
    assert response.status_code == HTTPStatus.OK
