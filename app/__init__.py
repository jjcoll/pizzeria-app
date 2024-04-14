from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# configure data base file
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)


with app.app_context():
    db.create_all()

from app import routes
