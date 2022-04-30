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


schema = strawberry.Schema(query=Query)
