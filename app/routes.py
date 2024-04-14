from flask import render_template, url_for, jsonify, request
from app import app, db
from app.models import Order, OrderItem


@app.route("/")
@app.route("/home")
def home_page():

    return render_template(
        "index.html", js_file=url_for("static", filename="js/menu.js")
    )


@app.route("/order")
def order_page():
    return render_template(
        "order.html", js_file=url_for("static", filename="js/order.js")
    )


@app.route("/menu")
def menu_page():
    return render_template(
        "menu.html", js_file=url_for("static", filename="js/menu.js")
    )


@app.route("/kitchen")
def kitchen_page():
    return render_template(
        "kitchen.html", js_file=url_for("static", filename="js/kitchen.js")
    )


@app.route("/payment")
def payment_page():

    return render_template(
        "payment.html", js_file=url_for("static", filename="js/payment.js")
    )


@app.route("/post-order", methods=["POST"])
def recieve_order():

    data = request.json

    order = data.get("order")

    newOrder = Order(itemAmount=len(order))
    print(newOrder.id)
    db.session.add(newOrder)
    # must commit to access order id
    db.session.commit()

    for item in order:
        newItem = OrderItem(
            orderId=newOrder.id,
            name=item["name"],
            timeToCook=item["timeToCook"],
            quantity=item["quantity"],
        )
        db.session.add(newItem)

    db.session.commit()

    print(order)

    return jsonify(
        {
            "message": "Order received successfully",
            "order": order,
            "orderId": newOrder.id,
        }
    )


@app.route("/track-order/<orderId>")
def track_order_page(orderId):

    return render_template(
        "track-order.html", js_file=url_for("static", filename="js/trackOrder.js")
    )


@app.route("/get-order-status/<orderId>", methods=["GET"])
def get_order_status(orderId):

    print(orderId)

    order = Order.query.get(orderId)

    items = []

    if order:
        order_items = order.items.all()

        for item in order_items:
            items.append(
                {"coocked": item.coocked, "name": item.name, "quantity": item.quantity}
            )

        return jsonify({"items": items, "orderId": order.id})

    else:
        return jsonify({"message": "Order not found"}), 404


@app.route("/get-orders/<filter>")
def get_order(filter):

    if filter == "all":
        data_orders = Order.query.all()
    elif filter == "completed":
        data_orders = Order.query.filter(Order.completed == True).all()
    elif filter == "not-done":
        data_orders = Order.query.filter(Order.completed == False).all()

    orders = []

    for order_data in data_orders:

        items = []

        order_items = order_data.items.all()

        for item in order_items:
            items.append(
                {
                    "name": item.name,
                    "timeToCook": item.timeToCook,
                    "quantity": item.quantity,
                    "coocked": item.coocked,
                    "id": item.id,
                }
            )

        orders.append(
            {
                "date": order_data.date,
                "completed": order_data.completed,
                "items": items,
                "id": order_data.id,
            }
        )

    return jsonify({"orders": orders})


@app.route("/update-order", methods=["POST"])
def update_order():

    data = request.json
    id = data.get("id")

    order = Order.query.get(id)
    order.completed = not order.completed
    # commit changes to order
    db.session.commit()

    print(order.completed)

    if order:
        return jsonify({"message": "Order updated correctly"})
    else:
        return jsonify({"message": "Order not found"}), 404


@app.route("/update-item", methods=["POST"])
def update_item():
    data = request.json
    id = data.get("id")

    print(id)

    order = OrderItem.query.get(id)
    # trigger done not done
    order.coocked = not order.coocked
    # commit changes to order
    db.session.commit()

    if order:
        return jsonify({"message": "Item updated correctly"})
    else:
        return jsonify({"message": "Item not found"}), 404
