from http import HTTPStatus

import edgedb
from flask import Blueprint, request

actor = Blueprint("actor", __name__)
client = edgedb.create_client()

################################
# Get actors
################################


@actor.route("/actors", methods=["GET"])
def get_actors() -> tuple[str, int]:
    actors = client.query_json(
        """
        SELECT Actor {name, age, height}
    """
    )
    return actors, HTTPStatus.OK


################################
# Create actors
################################


@actor.route("/actors", methods=["POST"])
def post_actors():
    incoming_payload = request.json

    # Exception handling.
    if not incoming_payload:
        return {"error": "Bad request"}, HTTPStatus.BAD_REQUEST

    if not (name := incoming_payload.get("name")):
        return {"error": "Field 'name' is required."}

    if len(name) > 50:
        return {"error": "Field 'name' cannot be longer than 50 characters."}

    if age := incoming_payload.get("age"):
        if age <= 0:
            return {"error": "Field 'age' cannot be less than or equal to 0."}

    if height := incoming_payload.get("height"):
        if not 0 <= height <= 300:
            return {"error": "Field 'height' must between 0 and 300 cm."}

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

    return actor, HTTPStatus.CREATED


################################
# Update users
################################


@actor.route("/actors", methods=["PUT"])
def put_actors():
    incoming_payload = request.json
    filter_name = request.args.get("filter_name")

    if not incoming_payload:
        return {"error": "Bad request"}, HTTPStatus.BAD_REQUEST

    if not filter_name:
        return {
            "error": "Query parameter 'filter_name' must be provided",
        }, HTTPStatus.BAD_REQUEST

    if not (name := incoming_payload.get("name")):
        return {"error": "Field 'name' is required."}

    if len(name) > 50:
        return {"error": "Field 'name' cannot be longer than 50 characters."}

    if age := incoming_payload.get("age"):
        if age <= 0:
            return {"error": "Field 'age' cannot be less than or equal to 0."}

    if height := incoming_payload.get("height"):
        if not 0 <= height <= 300:
            return {"error": "Field 'height' must between 0 and 300 cm."}

    actors = client.query_json(
        """
        WITH filter_name:=<str>$filter_name, name:=<str>$name,
            age:=<optional int16>$age, height:=<optional int16>$height
            SELECT (
                UPDATE Actor FILTER .name=filter_name
                SET {name:=name, age:=age, height:=height}
             ){name, age, height};""",
        filter_name=filter_name,
        name=name,
        age=age,
        height=height,
    )
    return actors, HTTPStatus.OK


################################
# Delete users
################################


@actor.route("/actors", methods=["DELETE"])
def delete_actors():
    if not (filter_name := request.args.get("filter_name")):
        return {
            "error": "Query parameter 'filter_name' must be provided",
        }, HTTPStatus.BAD_REQUEST

    actors = client.query_json(
        "SELECT (DELETE Actor FILTER .name=<str>$filter_name){name}",
        filter_name=filter_name,
    )

    return actors, HTTPStatus.OK
