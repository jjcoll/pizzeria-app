
const itemContainer = document.querySelector('.item-container')
const orderContainer = document.querySelector('.order-container')
const totalItemsEl = document.querySelector('.total-items')
const coockedItemsEl = document.querySelector('.coocked-items')
const orderCompleteEl = document.querySelector('.order-complete-message')
const progressBarEl = document.querySelector('.progress-bar')
const orderNumberEl = document.querySelector('.order-number')


function updateDisplay(items) {

    itemContainer.innerHTML = ''

    let totalItems = items.length
    let coockedItems = 0

    items.forEach(item => {

        if (item.coocked) {
            coockedItems += 1
        }

        const html = `  
            <span class="status ${item.coocked ? 'status-done' : ''}">
            ${item.coocked ? 'done' : 'busy'}</span>${item.quantity} x ${item.name}
        `
        const element = document.createElement('p')
        element.innerHTML = html
        itemContainer.appendChild(element)
    })

    totalItemsEl.innerText = totalItems
    coockedItemsEl.innerText = coockedItems

    const width = (coockedItems / totalItems) * 100

    // set width css 

    progressBarEl.style.width = `${width}%`

    if (totalItems === coockedItems) {
        orderCompleteEl.classList.remove('hidden')
    }


}

async function getOrderStatus(orderId) {
    showLoader()
    const url = `http://127.0.0.1:5000/get-order-status/${orderId}`

    try {
        const res = await fetch(url)

        if (res.status === 404) {
            hideLoader()
            orderContainer.classList.remove('hidden')
            orderContainer.innerHTML = `
            <b>404 order not found</b>
            `

        } else {

            const { items, orderId } = await res.json()
            hideLoader()

            orderNumberEl.innerText = orderId

            console.log(items)

            updateDisplay(items)
            orderContainer.classList.remove('hidden')

        }





    } catch (error) {
        console.log(error)
    }

}

const url = window.location.href.split('/')
const orderId = url[url.length - 1]
console.log(orderId)


setInterval(() => {
    getOrderStatus(orderId)
}, 2000)