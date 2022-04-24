from flask import Blueprint, request
from http import HTTPStatus
import edgedb

movie = Blueprint("movie", __name__)
client = edgedb.create_client()

@movie.route("/movies", methods=["GET"])
def get_movies():
    movies = client.query_json(
        """
        SELECT Movie {name, year, actors:{name, age}}
    """
    )
    return movies, HTTPStatus.OK


@movie.route("/movies", methods=["POST"])
def post_movies():
    incoming_payload = request.json

    # Exception handling.
    if not incoming_payload:
        return {"error": "Bad request"}, HTTPStatus.BAD_REQUEST

    if not (name := incoming_payload.get("name")):
        return {"error": "Field 'name' is required."}

    if len(name) > 50:
        return {"error": "Field 'name' cannot be longer than 50 characters."}

    if year := incoming_payload.get("year"):
        if year < 1850:
            return {"error": "Field 'year' cannot be less than 1850."}

    actor_names = incoming_payload.get("actor_names")

    # Save data to db.
    actor = client.query_single_json(
        """
        WITH name:=<str>$name, year:=<optional int16>$year,
            actor_names:=<optional str>$actor_names
            SELECT (
                INSERT Actor {name:=name, year:=year,
                actors:=}
            ){name, age, height};
        """,
        name=name,
        age=age,
        height=height,
    )

    return actor, HTTPStatus.CREATED



@movie.route("/movies", methods=["PUT"])
def put_movies():
    return {"hello": "flask"}


@movie.route("/movies", methods=["DELETE"])
def delete_movies():
    return {"hello": "flask"}
