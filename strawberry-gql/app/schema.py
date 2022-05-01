from __future__ import annotations

import json

import edgedb
import strawberry

client = edgedb.create_async_client()


@strawberry.type
class Actor:
    name: str
    age: int | None = None
    height: int | None = None


@strawberry.type
class Movie:
    name: str
    year: int | None
    actors: list[Actor]


@strawberry.type
class ValidationError:
    detail: str


ResponseActor = strawberry.union("ResponseActor", (Actor, ValidationError))
ResponseMovie = strawberry.union("ResponseMovie", (Movie, ValidationError))


actor = Actor(name="RDJ", age=57, height=175)
movie = Movie(
    name="Avengers",
    year=2012,
    actors=[actor],
)


@strawberry.type
class Query:
    @strawberry.field
    async def get_actors(self, filter_name: str | None = None) -> list[Actor]:
        if filter_name:
            actors_json = await client.query_json(
                """
                SELECT Actor {name, age, height}
                    FILTER .name=<str>$filter_name
            """,
                filter_name=filter_name,
            )
        else:
            actors_json = await client.query_json(
                """
                SELECT Actor {name, age, height}
            """
            )
        actors = json.loads(actors_json)

        return [
            Actor(name, age, height)
            for (name, age, height) in (d.values() for d in actors)
        ]

    @strawberry.field
    async def get_movies(self, filter_name: str | None) -> list[Movie]:
        if filter_name:
            movies_json = await client.query_json(
                """
                SELECT Movie {name, year, actors : {name}}
                    FILTER .name=<str>$filter_name
            """,
                filter_name=filter_name,
            )
        else:
            movies_json = await client.query_json(
                """
                SELECT Movie {name, year, actors : {name}}
            """
            )

        # Deserialize.
        movies = json.loads(movies_json)
        for idx, movie in enumerate(movies):
            actors = [
                Actor(name) for d in movie.get("actors", []) for name in d.values()
            ]
            movies[idx] = Movie(movie.get("name"), movie.get("year"), actors)

        return movies


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
        movie_json = await client.query_single_json(
            """
            WITH name:=<str>$name,
                year:=<optional int16>$year,
                actor_names:=<optional array<str>>$actor_names

            SELECT (
                INSERT Movie {
                    name:=name,
                    year:=year,
                    actors:=(
                        SELECT DETACHED Actor
                        FILTER .name IN array_unpack(actor_names)
                        )
                }
            ){name, year, actors : {name}}
        """,
            name=name,
            year=year,
            actor_names=actor_names,
        )

        movie = json.loads(movie_json)
        actors = [Actor(name) for d in movie.get("actors", []) for name in d.values()]
        return Movie(movie.get("name"), movie.get("year"), actors)

    @strawberry.mutation
    async def update_movie(
        self, name: str, year: int | None, actor_names: list[str]
    ) -> ResponseMovie:
        return Movie(name, year, [Actor(name) for name in actor_names])


schema = strawberry.Schema(query=Query, mutation=Mutation)
