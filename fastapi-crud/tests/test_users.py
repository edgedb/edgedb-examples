"""
Currently these tests use the same database that the app uses.
In a real application, you'd want to patch the 'client' to use a
separate database.

"""

from http import HTTPStatus

from fastapi.testclient import TestClient

from app.main import fast_api


def test_get_users():
    with TestClient(fast_api) as client:
        response = client.get("/users")
    assert response.status_code == HTTPStatus.OK


def test_post_user():
    with TestClient(fast_api) as client:
        response = client.post(
            "/users", json={"name": "test"}
        )
    assert response.status_code == HTTPStatus.CREATED
    assert response.json()["name"] == "test"
