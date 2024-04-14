const paymentBtn = document.querySelector('.submit-button')

const paymentOptionBtn = document.querySelectorAll('.payment-option')

const inputFields = document.querySelector('.input-fields')

let paymentOption = 'credit-card'


const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
const currentYear = currentDate.getFullYear();

function validateEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

function validatePassword(password) {
    if (password.length >= 8) {
        return true
    } else {
        return false
    }
}

function validateCardNumber(cardNumber) {

    // Remove any spaces or hyphens from the card number
    console.log(cardNumber)
    cardNumber = cardNumber.replace(/ /g, '').replace(/-/g, '');

    // Check if the card number is composed entirely of digits
    if (!/^\d+$/.test(cardNumber)) {
        return false;
    }

    // Reverse the card number
    cardNumber = cardNumber.split('').reverse().join('');

    let total = 0;
    for (let i = 0; i < cardNumber.length; i++) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        if (i % 2 === 1) {
            // Double every second digit
            digit *= 2;
            if (digit > 9) {
                // If the doubled digit is greater than 9, subtract 9 from it
                digit -= 9;
            }
        }
        total += digit;
    }

    // If the total modulo 10 is equal to 0, the card number is valid
    return total % 10 === 0;

}

function validateDate(date) {
    // valid format
    if (date.length !== 7) return false

    // '/' in correct palce
    const parts = date.split('/')
    if (parts.length !== 2) return false


    let month = Number(parts[0])
    if (month < 1 || month > 12) return false

    let year = Number(parts[1])
    if (isNaN(month) || isNaN(year)) return false


    if (year >= currentYear && month >= currentMonth) {
        return true
    }
    return false
}

function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

function validateCvv(cvv) {
    return /^\d{3}$/.test(cvv);
}

function validatePayment() {

    console.log(paymentOption)

    if (paymentOption === 'credit-card') {
        // check name
        const name = document.getElementById('name').value
        const validName = validateName(name)
        if (!validName) throwAlert('Error in field name', 'Please include a valid name', 'danger')

        // check card number
        const cardNumber = document.getElementById('card-number').value
        const validCardNumber = validateCardNumber(cardNumber)
        if (!validCardNumber) throwAlert('Error in card number', 'Please include a valid card number', 'danger')

        // check expiry date
        const expiryDate = document.getElementById('expiry-date').value
        const validDate = validateDate(expiryDate)
        if (!validDate) throwAlert('Error in date', 'Please include a valid date', 'danger')

        // check cvv
        const cvv = document.getElementById('cvv').value
        const validCvv = validateCvv(cvv)
        if (!validCvv) throwAlert('Error in cvv', 'Please include a valid cvv', 'danger')

        if (validName && validCardNumber && validDate && validCvv) {
            // data is valid
            submitOrder()
        } else {

        }


    } else if (paymentOption === 'paypal') {

        const email = document.getElementById('email').value
        const validEmail = validateEmail(email)
        if (!validEmail) throwAlert('Error in email', 'Please include a valid email', 'danger')

        const password = document.getElementById('password').value
        const validPassword = validatePassword(password)
        if (!validPassword) throwAlert('Error in password', 'Please include a valid password', 'danger')

        if (validEmail && validPassword) {
            submitOrder()
        }
    }
}

function updateForm(paymentOption) {

    // check default button 
    document.getElementById(paymentOption).setAttribute('checked', 'True')

    if (paymentOption === 'credit-card') {

        inputFields.innerHTML = `

            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" class="input-field" placeholder="Jhon Doe">
            <label for="card-number">Card Number</label>
            <input type="text" id="card-number" name="card-number" class="input-field" placeholder="xxxx xxxx xxxx 1234">
            <label for="expiry-date">Expiry Date</label>
            <input type="text" id="expiry-date" name="expiry-date" class="input-field" placeholder="mm/yyyy">
            <label for="cvv">CVV</label>
            <input type="text" id="cvv" name="cvv" class="input-field" placeholder="xxx">
            `



    } else if (paymentOption === 'paypal') {

        inputFields.innerHTML = `
            <input type="text" id="email" name="email" class="input-field" placeholder="Email">
            <input type="password" id="password" name="password" class="input-field" placeholder="Password"> 
            `
    }
}

paymentOptionBtn.forEach(option => {
    option.addEventListener('click', (e) => {
        console.log(e.target.value)

        paymentOption = e.target.value

        updateForm(paymentOption)


    })
})

paymentBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('clicked')

    validatePayment()
})

async function submitOrder() {
    const url = 'http://127.0.0.1:5000/post-order'

    let order = JSON.parse(localStorage.getItem('order'))
    console.log(order)

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
        updateCart()
        // updateOrder()


        const message = resData?.message
        const serverOrder = resData?.order
        const orderId = resData?.orderId

        console.log(serverOrder)
        console.log(orderId)

        // hide form and show order summary
        document.querySelector('.payment-form').classList.add('hidden')

        const completeOrderContainer = document.querySelector('.order-complete')
        completeOrderContainer.classList.remove('hidden')

        const orderSummary = serverOrder.map(item => {
            return (
                `<tr> 
                    <td>${item.quantity} </td>
                    <td>${item.name} </td>
                    <td>${item.price} $</td>
                    <td>${item.price * item.quantity} $</td>
                </tr>`)
        }).join('')

        console.log(orderSummary)

        completeOrderContainer.innerHTML = `
            <p>We have recieved your order!</p>
            <p>Your order number is ${orderId}</p>
            <p>Order summary: </p>
            <table class="summary-table">
                <tr>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                </tr> 
            ${orderSummary}
            </table>
            <p>Total ${calculateTotal(serverOrder)} $</p>
        `




        // throwAlert(message, `Your order number is ${orderNumber}`, 'success')


    } catch (error) {
        console.log('Error:', error)
    }
}

updateForm(paymentOption)
updateCart()

