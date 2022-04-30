from __future__ import annotations

import strawberry


@strawberry.type
class Actor:
    name: str
    age: int
    height: float


@strawberry.type
class Movie:
    name: str
    year: int
    actors: Actor


actor = Actor(name="RDJ", age=57, height=175)  # type: ignore
movie = Movie(
    name="Avengers",
    year=2012,
    actors=[actor],
)  # type: ignore


@strawberry.type
class Query:
    @strawberry.field
    def actors(self) -> list[Actor]:
        return [actor]

    @strawberry.field
    def movies(self) -> list[Movie]:
        return [movie]


@strawberry.type
class Mutation:
    @strawberry.mutation
    def add_actor(self, name: str, age: int | None, height: float | None) -> Actor:
        return Actor(name, age, height)

    @strawberry.mutation
    def add_movie(self, name: str, year: int | None, actor_names: list[str]) -> Movie:
        return Movie(name, year, [Actor(name) for name in actor_names])


schema = strawberry.Schema(query=Query, mutation=Mutation)
