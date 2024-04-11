let order = JSON.parse(localStorage.getItem('order'));
const orderContainer = document.querySelector('.order-container')

const cartItemsElement = document.querySelector('.cart-items')

const submitOrderBtn = document.querySelector('.submit-order')

function removeItem(item) {
    order = order.filter(orderItem => {
        return orderItem.name !== item.name
    })

    console.log(order)
}

function updateOrder() {

    orderContainer.innerHTML = ''

    // update cart
    cartItemsElement.innerText = order.length

    console.log(order)

    if (order.length === 0) {
        orderContainer.innerHTML = `
        <div class="empty-order">  
            <p>You have not selected any items, have a look at our menu to add items</p>
            <button class="btn"><a href="/menu">Menu</a></button>
        </div> 
        `
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
            })

            increaseQuantityBtn.addEventListener('click', () => {
                item.quantity += 1
                localStorage.setItem('order', JSON.stringify(order));
                updateOrder()
            })

            decreaseQuantityBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1
                    localStorage.setItem('order', JSON.stringify(order));
                    updateOrder()
                }

            })

            orderContainer.appendChild(element)
        }
        )
    }


}

updateOrder()


submitOrderBtn.addEventListener('click', async () => {

    if (order.length !== 0) {

        const url = 'http://127.0.0.1:5000/post-order'
        const data = {
            order: order
        }

        // send post request to server

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!res.ok) {
                throw new Error('Server response was not ok')
            }

            const resData = await res.json()

            // reset values
            order = []
            localStorage.setItem('order', JSON.stringify(order));
            cartItemsElement.innerText = 0
            updateOrder()

            // send to completed order page



            console.log(resData)
        } catch (error) {
            console.log('Error:', error)
        }
    }


})