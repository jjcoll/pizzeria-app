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