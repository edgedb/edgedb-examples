"""
Currently these tests use the same database that the app uses.
In a real application, you'd want to patch the 'client' to use a
separate database.

"""

import datetime
import uuid
from http import HTTPStatus

from app.queries import get_events_async_edgeql as get_events_qry


def test_get_events(test_client):
    response = test_client.get("/events")
    assert response.status_code == HTTPStatus.OK


def test_get_events_with_single_event(mocker, test_client):
    event_name = "Test"
    event_address = "Address"
    event_host = "Test Host"
    mocker.patch(
        "app.events.get_events_qry.get_events",
        return_value=[
            get_events_qry.GetEventsResult(
                id=uuid.uuid4(),
                name=event_name,
                address=event_address,
                host=get_events_qry.GetEventsResultHost(
                    id=uuid.uuid4(), name=event_host
                ),
                schedule=datetime.datetime.now(),
            )
        ],
    )
    response = test_client.get("/events")
    assert response.status_code == HTTPStatus.OK
    assert response.json()[0]["name"] == event_name


def test_get_events_with_multiple_events(mocker, test_client):
    event_1_name = "Test 1"
    event_2_name = "Test 2"
    event_1_address = "Address"
    event_2_address = "Address"
    event_1_host = "Test Host"
    event_2_host = "Test Host"
    mocker.patch(
        "app.events.get_events_qry.get_events",
        return_value=[
            get_events_qry.GetEventsResult(
                id=uuid.uuid4(),
                name=event_1_name,
                address=event_1_address,
                host=get_events_qry.GetEventsResultHost(
                    id=uuid.uuid4(), name=event_1_host
                ),
                schedule=datetime.datetime.now(),
            ),
            get_events_qry.GetEventsResult(
                id=uuid.uuid4(),
                name=event_2_name,
                address=event_2_address,
                host=get_events_qry.GetEventsResultHost(
                    id=uuid.uuid4(), name=event_2_host
                ),
                schedule=datetime.datetime.now(),
            ),
        ],
    )
    response = test_client.get("/events")
    assert response.status_code == HTTPStatus.OK
    assert response.json()[0]["name"] == event_1_name
    assert response.json()[1]["name"] == event_2_name


def test_post_event(tx_test_client):
    response = tx_test_client.post(
        "/events",
        json={
            "name": "test",
            "address": "test address",
            "host_name": "Test",
            "schedule": "2010-12-27T23:59:59-07:00",
        },
    )
    assert response.status_code == HTTPStatus.CREATED
    assert response.json()["name"] == "test"
