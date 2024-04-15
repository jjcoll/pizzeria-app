const editMenuContainerEl = document.querySelector('.edit-menu__container')
const menuTableEL = document.querySelector('.menu-table')
const floatingWindowEl = document.querySelector('.floating-window')
const windowContentEl = document.querySelector('.window-content')
const closeWindowBtn = document.querySelector('.close-window-btn')




async function getPizzaMenu() {
    const url = `http://127.0.0.1:5000/get-pizza-menu`

    try {
        const res = await fetch(url)
        if (res.status === 404) {
            return -1
        }
        const { menu } = await res.json()
        editMenuContainerEl.classList.remove('hidden')
        hideLoader()

        renderMenuTable(menu)

    } catch (error) {
        console.log(error)
    }
}

async function updateMenuItem(item) {

    const url = 'http://127.0.0.1:5000/update-pizza-menu'
    const data = {
        item: item
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

        // alert of update and re-render
        throwAlert(`${item.name} has been updated correctly`, '', 'success')
        getPizzaMenu()

        const resData = await res.json()

        console.log(resData)

    } catch (error) {
        console.log('Error:', error)
    }
}

function renderMenuTable(menu) {

    menuTableEL.innerHTML = ''

    menu.forEach(item => {

        const element = document.createElement('div')
        element.classList.add('menu-item')
        element.innerHTML = `
        <div class='item-description'>
            <p>${item.id}.</p> 
            <p>${item.name}</p> 
        </div>
        <div class='item-img'> 
            <img class="pizza__img" src='static/img/pizzas/${item.imageName}.png' /> 
        </div> 
        <div class='action-btn-container'>
            <button class='btn btn-view'>view</button>
            <button class='btn btn-edit'>edit</button>
            <button class='btn btn-remove'>delete</button>
        </div>
        `



        // view item
        element.querySelector('.btn-view').addEventListener('click', () => {
            floatingWindowEl.classList.remove('hidden')
            editMenuContainerEl.classList.add('blur-page')

            windowContentEl.innerHTML = `
            <p>Pizza Name: ${item.name}</p>
            <div class="flex">
                <p>Id: ${item.id}</p> 
                <p>Price: ${item.price}</p> 
            </div> 
            <div>
                <img class="pizza__img" src='static/img/pizzas/${item.imageName}.png' /> 
                <p>Image name: ${item.imageName}</p>
            </div>
            <div class='flex'>
                <p>Vegan: ${item.vegan}</p>
                <p>Sold out: ${item.soldOut}</p>
            </div>
                <p>Time to cook: ${item.timeToCook} seconds</p>
            `

            console.log('click')
        })

        // edit the item
        element.querySelector('.btn-edit').addEventListener('click', () => {
            console.log('click')
            floatingWindowEl.classList.remove('hidden')
            editMenuContainerEl.classList.add('blur-page')

            windowContentEl.innerHTML = `
                    <p>Pizza id: ${item.id}</p>
                    <form class='form'>
                        <p>Name</p>
                        <input type="text" id="name" name="name" class="input-field" value="${item.name}"> 

                        <p>Image Name</p>
                        <input type="text" id="imageName" name="imageName" class="input-field" value="${item.imageName}">  

                        <p>Price</p>
                        <input type="text" id="price" name="price" class="input-field" value="${item.price}">  

                        <div class='checkbox-container'>
                            <div class='input-checkbox-container'>
                                <input type="checkbox" id="vegan" name="vegan" class="input-field" ${item.vegan ? 'checked' : ''}>
                                <label for='vegan'>Vegan</label> 
                            </div>

                            <div class='input-checkbox-container'>
                                <input type="checkbox" id="soldOut" name="soldOut" class="input-field" ${item.soldOut ? 'checked' : ''}>   
                                <label for='soldOut'>Soldout</label> 
                            </div> 
                        </div>
                        

                        <p>Description</p>
                        <textarea id="description" name="description" class="input-field">${item.description}</textarea>

                        <p>Time to Cook</p>
                        <input type="text" id="timeToCook" name="timeToCook" class="input-field" value="${item.timeToCook}">  
                    </form>

                    <button class='btn form-btn save-btn'>Save Changes</button>
                    <button class='btn form-btn cancel-btn'>Cancel</button>
                `;


            // save changes
            windowContentEl.querySelector('.save-btn').addEventListener('click', () => {

                const editedItem = {
                    id: item.id,
                    name: windowContentEl.querySelector('#name').value,
                    imageName: windowContentEl.querySelector('#imageName').value,
                    price: parseFloat(windowContentEl.querySelector('#price').value),
                    vegan: windowContentEl.querySelector('#vegan').checked,
                    soldOut: windowContentEl.querySelector('#soldOut').checked,
                    description: windowContentEl.querySelector('#description').value,
                    timeToCook: parseInt(windowContentEl.querySelector('#timeToCook').value)
                }

                console.log(editedItem)

                updateMenuItem(editedItem)
                floatingWindowEl.classList.add('hidden')
                editMenuContainerEl.classList.remove('blur-page')

            })

            // cancel changes
            windowContentEl.querySelector('.cancel-btn').addEventListener('click', () => {
                floatingWindowEl.classList.add('hidden')
                editMenuContainerEl.classList.remove('blur-page')
            })

        })

        // remove the item
        element.querySelector('.btn-remove').addEventListener('click', () => {
            console.log('click')
            floatingWindowEl.classList.remove('hidden')
            editMenuContainerEl.classList.add('blur-page')
        })


        menuTableEL.appendChild(element)

    })



}

closeWindowBtn.addEventListener('click', () => {
    floatingWindowEl.classList.add('hidden')
    editMenuContainerEl.classList.remove('blur-page')
})

showLoader()
getPizzaMenu()