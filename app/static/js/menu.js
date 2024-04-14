const menuContainerEl = document.querySelector('.menu__container')
const menuContainer = document.querySelector('.menu-container');

async function getPizzaMenu() {

    const url = `http://127.0.0.1:5000/get-pizza-menu`

    try {

        const res = await fetch(url)

        if (res.status === 404) {

            return -1
        }


        const { menu } = await res.json()

        menuContainerEl.classList.remove('hidden')
        hideLoader()


        renderMenu(menu)



    } catch (error) {
        console.log(error)
    }

}




let order = JSON.parse(localStorage.getItem('order'));
if (!order) {
    order = []
}


// const cartItemsElement = document.querySelector('.cart-items')
// let cartItems = order.length
// cartItemsElement.innerText = cartItems


const deleteOrderBtn = document.querySelector('.btn-remove')
deleteOrderBtn.addEventListener('click', () => {

    // reset order
    order = []
    localStorage.setItem('order', JSON.stringify(order));

    // reset cart
    // cartItemsElement.innerText = 0
    // cartItems = 0
    updateCart()
})




function renderMenu(menu) {
    menu.map(item => {

        const elementHTML = `
    <div class="order-item"> 
        <div>
            <img class="pizza__img" src='static/img/pizzas/${item.imageName}.png' /> 
        </div>
        <div class='pizza__information'>
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
            throwAlert(item.name, 'Added to the cart', 'success')


            // check if item already in order
            const exists = order.findIndex(i => i.name === item.name)

            // add item to order
            if (exists === -1) {
                order.push({ ...item, "quantity": 1 })
                console.log('added to order')
                // cartItems += 1
                // cartItemsElement.innerText = cartItems


                // increase quantity 
            } else {
                console.log('item exists')
                order[0].quantity += 1
            }



            // save order 
            localStorage.setItem('order', JSON.stringify(order));
            updateCart()
        })

        menuContainer.appendChild(element)
    })

}

const submitOrder = document.querySelector('.submit-order')
submitOrder.addEventListener('click', () => {

    console.log(order)

    // save order to local storage
    localStorage.setItem('order', JSON.stringify(order));


    // redirect user
    window.location.href = '/order'
})


showLoader()
updateCart()
getPizzaMenu()