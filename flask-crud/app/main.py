from __future__ import annotations

from http import HTTPStatus

from flask import Flask

from app.actors import actor
from app.movies import movie

app = Flask(__name__)

app.register_blueprint(actor)
app.register_blueprint(movie)


@app.get("/health_check")
def health_check() -> tuple[dict, int]:
    return {"status": "Ok"}, HTTPStatus.OK
