// Retrieve tasks and nextId from localStorage
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    return randomId
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const newCard = $('<div>')
        .addClass('card drag mb-3')
        .attr('data-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<h5>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-id', task.id);
    cardDeleteBtn.on('click', () => {
        const recentTaskList = JSON.parse(localStorage.getItem("tasks")) || [];
        newCard.remove();

        const updatedTasks = recentTaskList.filter(newCard => newCard.id !== task.id);
        console.log(updatedTasks, recentTaskList);

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    });

    if (task.dueDate && task.state !== 'done') {
        const currentDate = dayjs();
        const jsDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (currentDate.isSame(jsDueDate, 'day')) {
            newCard.addClass('bg-warning');
        } else if (currentDate.isAfter(jsDueDate, 'day')) {
            newCard.addClass('bg-danger');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    newCard.append(cardHeader, cardBody)

    return newCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    for (const card of taskList) {
        if (card.state === "to-do") {
            $('#todo-cards').append(createTaskCard(card))
        } else if (card.state === "in-progress") {
            $('#in-progress-cards').append(createTaskCard(card))
        } else if (card.state === "done") {
            $('#done-cards').append(createTaskCard(card))
        }
    }
    $(".drag").draggable();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    event.preventDefault();
    const formData = $(this).parent().siblings(".modal-body").children().children();
    const title = formData.eq(0).children("input").val();
    const dueDate = formData.eq(1).children("input").val();
    const description = formData.eq(2).children("textarea").val();
    const newTask = {
        title,
        dueDate,
        description,
        id: generateTaskId(),
        state: "to-do"
    }
    console.log(newTask);
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $('#recipient-name').text("");
    renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    const taskId = ui.draggable[0].dataset.id;

    const newState = event.target.id;

    for (let task of taskList) {
        if (task.id === Number(taskId)) {
            task.state = newState;
        }
    }
    console.log(taskList);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $("#submit").on('click', handleAddTask)

    window.onload = renderTaskList();

    $("#task-due-date").datepicker({
        changeMonth: true,
        changeYear: true
    });

    $('.lane').droppable({
        accept: '.drag',
        drop: handleDrop,
    });

});
