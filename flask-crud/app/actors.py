from __future__ import annotations

import json
from http import HTTPStatus

import edgedb
from flask import Blueprint, request

actor = Blueprint("actor", __name__)
client = edgedb.create_client()

################################
# Get actors
################################


@actor.route("/actors", methods=["GET"])
def get_actors() -> tuple[dict, int]:
    actors = client.query_json(
        """
        SELECT Actor {name, age, height}
    """
    )
    response_payload = {"result": json.loads(actors)}
    return response_payload, HTTPStatus.OK


################################
# Create actor
################################


@actor.route("/actors", methods=["POST"])
def post_actor() -> tuple[dict, int]:
    incoming_payload = request.json

    # Exception handling.
    if not incoming_payload:
        return {"error": "Bad request"}, HTTPStatus.BAD_REQUEST

    if not (name := incoming_payload.get("name")):
        return {"error": "Field 'name' is required."}, HTTPStatus.BAD_REQUEST

    if len(name) > 50:
        return {
            "error": "Field 'name' cannot be longer than 50 characters."
        }, HTTPStatus.BAD_REQUEST

    if age := incoming_payload.get("age"):
        if age <= 0:
            return {
                "error": "Field 'age' cannot be less than or equal to 0."
            }, HTTPStatus.BAD_REQUEST

    if height := incoming_payload.get("height"):
        if not 0 <= height <= 300:
            return {
                "error": "Field 'height' must between 0 and 300 cm."
            }, HTTPStatus.BAD_REQUEST

    # Save data to db.
    actor = client.query_single_json(
        """
        WITH name:=<str>$name, age:=<optional int16>$age,
            height:=<optional int16>$height
            SELECT (
                INSERT Actor {name:=name, age:=age, height:=height}
            ){name, age, height};
        """,
        name=name,
        age=age,
        height=height,
    )
    response_payload = {"result": json.loads(actor)}
    return response_payload, HTTPStatus.CREATED


################################
# Update users
################################


@actor.route("/actors", methods=["PUT"])
def put_actors() -> tuple[dict, int]:
    incoming_payload = request.json
    filter_name = request.args.get("filter_name")

    if not incoming_payload:
        return {"error": "Bad request"}, HTTPStatus.BAD_REQUEST

    if not filter_name:
        return {
            "error": "Query parameter 'filter_name' must be provided",
        }, HTTPStatus.BAD_REQUEST

    if not (name := incoming_payload.get("name")):
        return {"error": "Field 'name' is required."}, HTTPStatus.BAD_REQUEST

    if len(name) > 50:
        return {
            "error": "Field 'name' cannot be longer than 50 characters."
        }, HTTPStatus.BAD_REQUEST

    if age := incoming_payload.get("age"):
        if age <= 0:
            return {
                "error": "Field 'age' cannot be less than or equal to 0."
            }, HTTPStatus.BAD_REQUEST

    if height := incoming_payload.get("height"):
        if not 0 <= height <= 300:
            return {
                "error": "Field 'height' must between 0 and 300 cm."
            }, HTTPStatus.BAD_REQUEST

    actors = client.query_json(
        """
        WITH filter_name:=<str>$filter_name, name:=<str>$name,
            age:=<optional int16>$age, height:=<optional int16>$height
            SELECT (
                UPDATE Actor FILTER .name=filter_name
                SET {name:=name, age:=age ?? .age, height:=height ?? .height}
             ){name, age, height};""",
        filter_name=filter_name,
        name=name,
        age=age,
        height=height,
    )
    response_payload = {"result": json.loads(actors)}
    return response_payload, HTTPStatus.OK


################################
# Delete users
################################


@actor.route("/actors", methods=["DELETE"])
def delete_actors() -> tuple[dict, int]:
    if not (filter_name := request.args.get("filter_name")):
        return {
            "error": "Query parameter 'filter_name' must be provided",
        }, HTTPStatus.BAD_REQUEST

    actors = client.query_json(
        "SELECT (DELETE Actor FILTER .name=<str>$filter_name){name}",
        filter_name=filter_name,
    )
    response_payload = {"result": json.loads(actors)}
    return response_payload, HTTPStatus.OK
