from flask import render_template, url_for, jsonify, request
from app import app, db
from app.models import Order, OrderItem, PizzaMenu
from werkzeug.utils import secure_filename
import os


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


@app.route("/edit-menu")
def edit_menu_page():
    return render_template(
        "edit-menu.html", js_file=url_for("static", filename="js/editMenu.js")
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
        data_orders = Order.query.filter(Order.completed).all()
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


@app.route("/get-pizza-menu", methods=["GET"])
def get_pizza_menu():

    menuData = PizzaMenu.query.all()
    menu = []
    for pizza in menuData:
        menu.append(
            {
                "id": pizza.id,
                "name": pizza.name,
                "imageName": pizza.imageName,
                "price": pizza.price,
                "vegan": pizza.vegan,
                "soldOut": pizza.soldOut,
                "description": pizza.description,
                "timeToCook": pizza.timeToCook,
            }
        )

    return jsonify({"menu": menu})


@app.route("/post-pizza-menu")
def post_pizza_menu():

    new_pizza = PizzaMenu(
        name=item["name"],
        imageName=item["imageName"],
        price=item["price"],
        vegan=item["vegan"],
        soldOut=item["soldOut"],
        description=item["description"],
        timeToCook=item["timeToCook"],
    )
    db.session.add(new_pizza)
    db.session.commit()


@app.route("/update-pizza-menu", methods=["POST"])
def update_pizza_menu_item():
    data = request.json
    itemData = data.get("item")

    if itemData:
        # Extract values from the received data
        item_id = itemData.get("id")
        name = itemData.get("name")
        imageName = itemData.get("imageName")
        price = itemData.get("price")
        vegan = itemData.get("vegan")
        soldOut = itemData.get("soldOut")
        description = itemData.get("description")
        timeToCook = itemData.get("timeToCook")

        # Fetch the item from the database
        item = PizzaMenu.query.get(item_id)

        if item:
            # Update the item with the new values
            item.name = name
            item.imageName = imageName
            item.price = price
            item.vegan = vegan
            item.soldOut = soldOut
            item.description = description
            item.timeToCook = timeToCook

            # Commit the changes to the database
            db.session.commit()

            return jsonify({"message": "Item updated correctly"})
        else:
            return jsonify({"message": "Item not found"}), 404
    else:
        return jsonify({"message": "Invalid data received"}), 400


@app.route("/delete-pizza-menu", methods=["POST"])
def delete_pizza_menu_item():

    data = request.json
    itemId = data.get("id")

    item = PizzaMenu.query.get(itemId)

    if item:
        # Delete the item from the database
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted successfully"})
    else:
        return jsonify({"message": "Item not found"}), 404


@app.route("/create-pizza-menu", methods=["POST"])
def create_pizza_menu():

    data = request.json
    item = data.get("item")

    if item:

        new_pizza = PizzaMenu(
            name=item["name"],
            imageName=item["imageName"],
            price=item["price"],
            vegan=item["vegan"],
            soldOut=item["soldOut"],
            description=item["description"],
            timeToCook=item["timeToCook"],
        )

        db.session.add(new_pizza)
        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Item updated correctly"})
    else:
        return jsonify({"message": "Invalid data received"}), 400


@app.route("/upload-pizza-img", methods=["POST"])
def upload_pizza_img():

    try:
        # Check if the POST request has a file part

        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]

        # Check if the file is uploaded
        if file.filename == "":
            return jsonify({"error": "No file selected for uploading"}), 400

        # Save the file to the desired folder
        print("-------------")
        print(app.config["UPLOAD_FOLDER"])
        print(file.filename)
        print(file)
        print(f"{app.config['UPLOAD_FOLDER']}/{file.filename}")
        file.save(f"{app.config['UPLOAD_FOLDER']}/{file.filename}")

        return jsonify({"message": "File uploaded successfully"}), 200
    except Exception as e:
        print("------------")
        print("something went wrong here", e)
        print(e)
        return jsonify({"error": str(e)}), 500
