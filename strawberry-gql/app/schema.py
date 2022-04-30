from __future__ import annotations

import json

import edgedb
import strawberry

client = edgedb.create_async_client()


@strawberry.type
class Actor:
    name: str
    age: int | None
    height: int | None


@strawberry.type
class Movie:
    name: str
    year: int | None
    actors: Actor


@strawberry.type
class ValidationError:
    detail: str


ResponseActor = strawberry.union("ResponseActor", [Actor, ValidationError])
ResponseMovie = strawberry.union("ResponseMovie", [Movie, ValidationError])


actor = Actor(name="RDJ", age=57, height=175)  # type: ignore
movie = Movie(
    name="Avengers",
    year=2012,
    actors=[actor],
)  # type: ignore


@strawberry.type
class Query:
    @strawberry.field
    def get_actors(self, filter_name: str | None) -> list[Actor]:
        return [actor for actor in [actor] if actor.name == filter_name]

    @strawberry.field
    def get_movies(self, filter_name: str | None) -> list[Movie]:
        return [movie for movie in [movie] if movie.name == filter_name]


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_actor(
        self, name: str, age: int | None, height: int | None
    ) -> ResponseActor:
        actor_json = await client.query_single_json(
            """
            SELECT (
                INSERT Actor {
                    name := <str>$name,
                    age:=<optional int16>$age,
                    height:=<optional int16>$height
                }
            ){name, age, height}
        """,
            name=name,
            age=age,
            height=height,
        )

        actor = json.loads(actor_json)
        return Actor(actor.get("name"), actor.get("age"), actor.get("height"))

    @strawberry.mutation
    async def update_actor(
        self, name: str, age: int | None, height: int | None
    ) -> ResponseActor:
        if name != "John":
            return ValidationError("Things went wrong")

        return Actor(name, age, height)

    @strawberry.mutation
    async def create_movie(
        self, name: str, year: int | None, actor_names: list[str]
    ) -> ResponseMovie:
        return Movie(name, year, [Actor(name) for name in actor_names])

    @strawberry.mutation
    async def update_movie(
        self, name: str, year: int | None, actor_names: list[str]
    ) -> ResponseMovie:
        return Movie(name, year, [Actor(name) for name in actor_names])


schema = strawberry.Schema(query=Query, mutation=Mutation)
