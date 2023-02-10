"""
Currently these tests use the same database that the app uses.
In a real application, you'd want to patch the 'client' to use a
separate database.

"""

from http import HTTPStatus
import uuid
import datetime

from app.queries import get_users_async_edgeql as get_users_qry


def test_get_users(test_client):
    response = test_client.get("/users")
    assert response.status_code == HTTPStatus.OK

def test_get_users_with_single_user(mocker, test_client):
    user_name = "Test"
    mocker.patch(
        "app.users.get_users_qry.get_users",
        return_value=[
            get_users_qry.GetUsersResult(
                id=uuid.uuid4(),
                name=user_name,
                created_at=datetime.datetime.now()
            )
        ]
    )
    response = test_client.get("/users")
    assert response.status_code == HTTPStatus.OK
    assert response.json()[0]["name"] == user_name

def test_get_users_with_multiple_users(mocker, test_client):
    user_1_name = "Test 1"
    user_2_name = "Test 2"
    mocker.patch(
        "app.users.get_users_qry.get_users",
        return_value=[
            get_users_qry.GetUsersResult(
                id=uuid.uuid4(),
                name=user_1_name,
                created_at=datetime.datetime.now()
            ),
            get_users_qry.GetUsersResult(
                id=uuid.uuid4(),
                name=user_2_name,
                created_at=datetime.datetime.now()
            )
        ]
    )
    response = test_client.get("/users")
    assert response.status_code == HTTPStatus.OK
    assert response.json()[0]["name"] == user_1_name
    assert response.json()[1]["name"] == user_2_name

def test_post_user(tx_test_client):
    response = tx_test_client.post(
        "/users", json={"name": "test"}
    )
    assert response.status_code == HTTPStatus.CREATED
    assert response.json()["name"] == "test"
