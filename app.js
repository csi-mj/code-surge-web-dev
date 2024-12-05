const inputBox = document.getElementById('input-box')
const enterButton = document.getElementById('enter-button')

const taskData = [
    {
        taskTitle: 'Clean bed',
        state: 'TODO'
    },
    {
        taskTitle: 'Have Breakfast',
        state: 'INPROG'
    },
    {
        taskTitle: 'Sleep',
        state: 'COMPLETED'
    },
    {
        taskTitle: 'Gym',
        state: 'TODO'
    }
]

// function renderTodoItems(data) {
//     const todoContainer = document.getElementById('to-do')
//     const ul = document.createElement('ul')

//     for (let i = 0; i < data.length; i++) {
//         const li = document.createElement('li')
//         li.innerHTML = data[i].taskTitle

//         ul.appendChild(li)
//     }

//     todoContainer.appendChild(ul)
// }

// function renderInprogressItems(data) {
//     const todoContainer = document.getElementById('in-progress')
//     const ul = document.createElement('ul')

//     for (let i = 0; i < data.length; i++) {
//         const li = document.createElement('li')
//         li.innerHTML = data[i].taskTitle

//         ul.appendChild(li)
//     }

//     todoContainer.appendChild(ul)
// }

// function renderCompletedItems(data) {
//     const todoContainer = document.getElementById('completed')
//     const ul = document.createElement('ul')

//     for (let i = 0; i < data.length; i++) {
//         const li = document.createElement('li')
//         li.innerHTML = data[i].taskTitle

//         ul.appendChild(li)
//     }

//     todoContainer.appendChild(ul)
// }


// const todoItems = data.filter(function (item) {
//     if (item.state === 'TODO') {
//         return item
//     }
// })

function renderItems(containerId, state, data) {
    const itemsToRender = data.filter(function (item) {
        if (item.state === state) {
            return item
        }
    })

    const container = document.getElementById(containerId)
    const ul = document.createElement('ul')

    for (let i = 0; i < itemsToRender.length; i++) {
        const li = document.createElement('li')
        li.innerHTML = itemsToRender[i].taskTitle

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.classList.add('delete-button')
        deleteButton.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent triggering state-switching event
            deleteTask(itemsToRender[i].taskTitle, containerId);
        });

        li.addEventListener('click', function () {
            switchState(itemsToRender[i].taskTitle);
        })

        li.appendChild(deleteButton)

        ul.appendChild(li)
    }

    container.appendChild(ul)
}

function addItemToState(containerId, data) {
    const container = document.getElementById(containerId)
    const ul = container.getElementsByTagName('ul')[0]

    const li = document.createElement('li')
    li.innerHTML = data.taskTitle

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.classList.add('delete-button')
    deleteButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent triggering state-switching event
        deleteTask(data.taskTitle, containerId);
    });

    li.addEventListener('click', function () {
        switchState(data.taskTitle);
    })

    li.appendChild(deleteButton)

    ul.appendChild(li)
}

function deleteTask(taskTitle, containerId) {
    const taskIndex = taskData.findIndex(task => task.taskTitle === taskTitle);
    if (taskIndex > -1) {
        taskData.splice(taskIndex, 1); // Remove task from data
    }

    // Remove the task from the UI
    const container = document.getElementById(containerId);
    const ul = container.querySelector('ul');
    if (!ul) return;

    const taskLi = Array.from(ul.children).find(li => li.textContent.includes(taskTitle));
    if (taskLi) {
        ul.removeChild(taskLi);
    }
}

function onEnter() {
    const inputValue = inputBox.value

    const newTask = { taskTitle: inputValue, state: 'TODO' }
    taskData.push(newTask)

    addItemToState('to-do', newTask)
    inputBox.value = '' // Clear input box
}

function switchState(taskTitle) {

    const task = taskData.find(t => t.taskTitle === taskTitle);
    if (!task) return;

    const oldState = task.state

    // Determine the new state and container
    const stateOrder = ['TODO', 'INPROG', 'COMPLETED']
    const currentIndex = stateOrder.indexOf(oldState)
    const nextIndex = (currentIndex + 1) % stateOrder.length // Cycle through states
    const newState = stateOrder[nextIndex]
    let newContainerId = getContainerId(newState)

    switch (newState) {
        case 'TODO':
            newContainerId = 'to-do'
            break
        case 'INPROG':
            newContainerId = 'in-progress'
            break
        case 'COMPLETED':
            newContainerId = 'completed'
            break
    }

    // Update the task state
    task.state = newState

    // Remove the task from the current list
    const oldContainerId = getContainerId(oldState)
    const oldContainer = document.getElementById(oldContainerId)
    const ul = oldContainer.querySelector('ul')
    const taskLi = Array.from(ul.children).find(li => li.childNodes[0].textContent === taskTitle)
    if (taskLi) ul.removeChild(taskLi)

    // Add the task to the new list
    addItemToState(newContainerId, task)
}

function getContainerId(state) {
    switch (state) {
        case 'TODO':
            return 'to-do'
        case 'INPROG':
            return 'in-progress'
        case 'COMPLETED':
            return 'completed'
    }
}

enterButton.addEventListener('click', onEnter)

renderItems('to-do', 'TODO', taskData)
renderItems('in-progress', 'INPROG', taskData)
renderItems('completed', 'COMPLETED', taskData)