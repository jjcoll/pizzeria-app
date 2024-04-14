let order = JSON.parse(localStorage.getItem('order'));
const orderContainer = document.querySelector('.order-container')
const submitOrderBtn = document.querySelector('.submit-order')


function removeItem(item) {
    order = order.filter(orderItem => {
        return orderItem.name !== item.name
    })

}

function updateOrder() {

    orderContainer.innerHTML = ''

    if (order.length === 0) {
        orderContainer.innerHTML = `
        <div class="empty-order">  
            <p>You have not selected any items, have a look at our menu to add items</p>
            <button class="btn"><a href="/menu">Menu</a></button>
        </div> 
        `

        // hide the button to pay
        document.querySelector('.continue-to-payment__section').classList.add('hidden')

    } else {

        order.forEach(item => {


            const elementHTML = `

        <div class="order-img-amount">
                    <div>
                        <p class="order__amount">${item.quantity}x</p>
                    </div>
                    <div class="img__container">
                        <img class="order__img" src="static/img/pizzas/${item.imageName}.png" alt="">
                    </div>
                </div>

                <div>
                    <p>${item.name}</p>
                    <p>Amount: <button class="order-btn ob-1">-</button> ${item.quantity} <button class="order-btn ob-2">+</button></p>
                    <p>Price: ${item.price * item.quantity} $</p>
                    <button class="btn-remove btn">Remove</button>
                </div>
    `

            const element = document.createElement("div")
            element.classList.add('order-item')
            element.innerHTML = elementHTML


            const increaseQuantityBtn = element.querySelector('.ob-2')
            const decreaseQuantityBtn = element.querySelector('.ob-1')
            const removeItemBtn = element.querySelector('.btn-remove')

            removeItemBtn.addEventListener('click', () => {
                console.log('clicked')
                removeItem(item)
                localStorage.setItem('order', JSON.stringify(order));
                updateOrder()
                // updateCart()
            })

            increaseQuantityBtn.addEventListener('click', () => {
                item.quantity += 1
                localStorage.setItem('order', JSON.stringify(order));
                updateOrder()
                // updateCart()
            })

            decreaseQuantityBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1
                    localStorage.setItem('order', JSON.stringify(order));
                    updateOrder()
                    // updateCart()
                }

            })

            orderContainer.appendChild(element)
        }
        )
    }
    updateCart()
    document.querySelector('.total-price').innerText = calculateTotal(order)
}

updateOrder()
updateCart()


submitOrderBtn.addEventListener('click', async () => {

    if (order.length !== 0) {

        // send to completed order page
        window.location.href = '/payment'

    }


})