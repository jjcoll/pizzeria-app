console.log('hello kitchen')

// const getOrdersBtn = document.querySelector('.get-orders')
const filterBtns = document.querySelectorAll('.filter-btn')


let filter = 'not-done'

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        getOrders(e.target.value)
        filter = e.target.value

        filterBtns.forEach(btn => btn.classList.remove('filter-btn__active'))
        e.target.classList.add('filter-btn__active')

    })
})

async function markAsDone(id) {

    const url = 'http://127.0.0.1:5000/update-item'
    const data = {
        "id": id
    }

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

        console.log(resData)

    } catch (error) {
        console.log('Error:', error)
    }


    // only get not completed orders
    getOrders(filter)


}

async function markAsCompleted(id) {

    const url = 'http://127.0.0.1:5000/update-order'
    const data = {
        "id": id
    }

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

        console.log(resData)

    } catch (error) {
        console.log('Error:', error)
    }


    // only get not completed orders
    getOrders(filter)


}

function getTime(dateString) {
    // Convert the string to a Date object
    const date = new Date(dateString);

    // Extract the hour and minutes
    const hour = date.getHours();
    const minutes = date.getMinutes();

    // Format the hour and minutes (add leading zero if necessary)
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return the formatted string
    return `${formattedHour}:${formattedMinutes}`;
}

function removePizza(string) {
    // Use the replace method to remove the word "pizza" (case insensitive)
    const result = string.replace(/pizza/gi, '');

    // Trim the resulting string to remove leading and trailing spaces
    return result.trim();
}

function getOvenTime(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad the minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds into a string in the format "mm:ss"
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

    return formattedTime;
}

async function getOrders(filter) {

    const url = `http://127.0.0.1:5000/get-orders/${filter}`

    try {
        const res = await fetch(url)
        const { orders } = await res.json()
        const orderContainer = document.querySelector('.order__container')
        orderContainer.innerHTML = ''

        console.log(orders.length)

        if (orders.length === 0) {
            // no orders
            orderContainer.innerHTML = '<p class="no-orders">No orders yet</p>'
        } else {
            orders.forEach((order, i) => {

                const orderElement = document.createElement('div')
                orderElement.classList.add('order')
                orderElement.id = i
                orderElement.innerHTML = `
                <div class="flex">
                    <p><i class="fa-solid fa-hashtag"></i> ${order.id}</p>
                    <p><i class="fa-solid fa-clock"></i> ${getTime(order.date)}</p>
                </div> 
            `

                order.items.forEach((item, i) => {
                    const itemElement = document.createElement('div')
                    itemElement.classList.add(`${item.coocked ? 'item-completed' : 'item'}`)
                    itemElement.classList.add('item')
                    itemElement.setAttribute('data-id', item.id)
                    itemElement.id = i
                    itemElement.innerHTML = ` 
                    <div class="flex">
                        <p>${item.quantity} x ${removePizza(item.name)} </p>
                        <p><i class="fa-regular fa-clock"></i> ${getOvenTime(item.timeToCook)}</p>
                    </div>
                    <button class="btn done-btn">${item.coocked ? 'Undo' : 'Done'}</button>
                `
                    orderElement.appendChild(itemElement)


                })

                orderContainer.appendChild(orderElement)

                const doneBtn = orderElement.querySelectorAll('.done-btn')
                doneBtn.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.parentNode.id
                        order.items[id].coocked = !order.items[id].coocked
                        markAsDone(e.target.parentNode.getAttribute('data-id'))

                        // if (e.target.parentNode.classList.contains('item-completed')) {
                        //     // change background of item
                        //     e.target.parentNode.classList.remove('item-completed')

                        //     // change button to undo
                        //     e.target.innerText = 'Done'
                        // } else {
                        //     // change background of item
                        //     e.target.parentNode.classList.add('item-completed')

                        //     // change button to undo
                        //     e.target.innerText = 'Undo'
                        // }

                        let orderIsComplete = true
                        order.items.forEach(item => {
                            if (!item.coocked) orderIsComplete = false
                        })
                        if (orderIsComplete) {
                            // mark order as completed and save to the database
                            order.completed = true

                            markAsCompleted(order.id)


                        } else {
                            order.completed = false
                        }

                        console.log(order)

                    })

                })


            });

        }




    } catch (error) {
        console.log(error)
    }
}



// getOrdersBtn.addEventListener('click', () => {
//     getOrders()
// })

getOrders(filter)

setInterval(() => {
    getOrders(filter)
}, 2000)