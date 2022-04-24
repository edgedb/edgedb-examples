from flask import Flask

from app.actors import actor
from app.movies import movie

app = Flask(__name__)

app.register_blueprint(actor)
app.register_blueprint(movie)
