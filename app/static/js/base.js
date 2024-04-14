function updateCart() {

    console.log('update cart')

    let order = JSON.parse(localStorage.getItem('order'));
    if (!order) {
        order = []
    }

    let orderLength = order.length
    const cartItemsElement = document.querySelector('.cart-items')
    cartItemsElement.innerText = orderLength
}