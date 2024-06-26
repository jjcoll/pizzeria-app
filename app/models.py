from app import db
import datetime
import pytz


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    itemAmount = db.Column(db.Integer, nullable=False)
    date = db.Column(
        db.DateTime,
        default=lambda: datetime.datetime.now(pytz.timezone("Europe/Amsterdam")),
    )
    items = db.relationship("OrderItem", backref="order", lazy="dynamic")
    completed = db.Column(db.Boolean, nullable=False, default=False)


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    coocked = db.Column(db.Boolean, nullable=False, default=False)
    name = db.Column(db.String(120), nullable=False)
    timeToCook = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    orderId = db.Column(db.Integer, db.ForeignKey("order.id"))


class PizzaMenu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    imageName = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    vegan = db.Column(db.Boolean, nullable=False)
    soldOut = db.Column(db.Boolean, nullable=False, default=False)
    description = db.Column(db.String(1500), nullable=False)
    timeToCook = db.Column(db.Integer, nullable=False)
