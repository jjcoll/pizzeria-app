import { menu } from "./data.js";

console.log(menu)

const menuContainer = document.querySelector('.menu-container');


let order = JSON.parse(localStorage.getItem('order'));
if (!order) {
    order = []
}

const cartItemsElement = document.querySelector('.cart-items')
let cartItems = order.length
cartItemsElement.innerText = cartItems


const deleteOrderBtn = document.querySelector('.btn-remove')
deleteOrderBtn.addEventListener('click', () => {

    // reset order
    order = []
    localStorage.setItem('order', JSON.stringify(order));

    // reset cart
    cartItemsElement.innerText = 0
    cartItems = 0
})


const alertContainer = document.querySelector('.alert__container')
function throwAlert(message) {
    const alert = document.createElement('div')
    alert.classList.add('alert-success')
    alert.innerHTML = `
            <p><strong>Product Added!</strong> ${message}</p>
            <span class="closebtn" onclick="this.parentElement.style.display='none';"><i
                    class="fa-solid fa-xmark"></i></span>
        `
    alertContainer.appendChild(alert)

    setTimeout(() => {
        console.log('removing thing')
        const firstChild = alertContainer.querySelector('div');
        if (firstChild) {
            alertContainer.removeChild(firstChild);
        }
    }, 3000)
}


menu.map(item => {

    const elementHTML = `
    <div class="order-item"> 
        <div>
            <img class="pizza__img" src='static/img/pizzas/${item.imageName}.png' /> 
        </div>
        <div>
            <h2 class="pizza-name">${item.name}</h2>
            <p class="pizza-desc">${item.description}</p>
            <div class="pizza-price-btn">  
                <p class="pizza-price">${item.price} $</p>
                <button class="add-to-order btn">Add to Order</button> 
            </div> 
        </div>
        
    </div>
    
    `

    const element = document.createElement("div")
    element.innerHTML = elementHTML

    const button = element.querySelector('.add-to-order')
    button.addEventListener('click', () => {


        // alert the user
        throwAlert(item.name)


        // check if item already in order
        const exists = order.findIndex(i => i.name === item.name)

        // add item to order
        if (exists === -1) {
            order.push({ ...item, "quantity": 1 })
            console.log('added to order')
            cartItems += 1
            cartItemsElement.innerText = cartItems


            // increase quantity 
        } else {
            console.log('item exists')
            order[0].quantity += 1
        }


        // save order 
        localStorage.setItem('order', JSON.stringify(order));
    })

    menuContainer.appendChild(element)
})

const submitOrder = document.querySelector('.submit-order')
submitOrder.addEventListener('click', () => {

    console.log(order)

    // save order to local storage
    localStorage.setItem('order', JSON.stringify(order));


    // redirect user
    window.location.href = '/order'
})


