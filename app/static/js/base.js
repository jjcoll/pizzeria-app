console.log('hello from base')

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


// Loader
const loaderEl = document.querySelector('.loader')
function hideLoader() {
    loaderEl.classList.add('hidden')
}

function showLoader() {
    loaderEl.classList.remove('hidden')
}


const alertContainer = document.querySelector('.alert__container')
function throwAlert(m1, m2, type) {


    let timeOut = 3000


    const alert = document.createElement('div')
    alert.classList.add('alert')

    if (type === 'success') {
        alert.classList.add('alert-success')

    } else if (type === 'danger') {
        alert.classList.add('alert-danger')
        timeOut = 6000
    }

    alert.innerHTML = `
            <p><strong>${m1}!</strong> ${m2}</p>
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
    }, timeOut)
}


function calculateTotal(order) {
    const total = order.reduce((acc, item) => {
        return acc += (item.price * item.quantity)
    }, 0)

    return total
}


function formatToEuro(number) {
    // Format the number to have two decimal places
    const formattedNumber = parseFloat(number).toFixed(2);

    // Add euro symbol and thousand separators
    const formattedEuro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(formattedNumber);

    return formattedEuro;
}