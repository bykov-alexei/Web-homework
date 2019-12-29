let checkboxes = document.querySelectorAll('.custom-checkbox');
for (let checkbox of checkboxes) {
    checkbox.addEventListener('click', customCheckboxClick);
}
let taskCheckboxes = document.querySelectorAll('.task-field');
for (let taskCheckbox of taskCheckboxes) {
    taskCheckbox.addEventListener('click', completeTask);
}
let remove_buttons = document.querySelectorAll('.remove-button');
for (let button of remove_buttons) {
    button.addEventListener('click', removeTask);
}
let edit_buttons = document.querySelectorAll('.edit-button');
for (let button of edit_buttons) {
    button.addEventListener('click', editTask);
}
let add_button = document.querySelector('.add-button');
let cancel_button = document.querySelector('.cancel-button');
add_button.addEventListener('click', addTask);
cancel_button.addEventListener('click', cancelEdition);


function makeField(name, hiprio) {
    let field = document.createElement('div');
    field.classList.add('task-field');
    field.addEventListener('click', completeTask)
    if (hiprio)
        field.classList.add('hiprio-task');
    let span = document.createElement('span');
    span.innerText = name;
    let img1 = document.createElement('div');
    img1.classList.add('edit-button');
    img1.addEventListener('click', editTask);
    let img2 = document.createElement('div');
    img2.addEventListener('click', removeTask);
    img2.classList.add('remove-button');
    field.appendChild(span);
    field.appendChild(img2);
    field.appendChild(img1);
    return field;
}

function advancedToggle(classList, cls, add) {
    if (!classList.contains(cls) && add) {
        classList.add(cls);
    } else if (classList.contains(cls) && !add) {
        classList.remove(cls);
    }
}


function customCheckboxClick(event) {
    let checkbox = event.target;
    checkbox.classList.toggle('checkbox-checked');
}

function addTask(event) {
    let taskList = event.target.closest('.task-list');
    let taskEdit = taskList.parentElement.querySelector('.task-edit');
    taskEdit.style.visibility = 'visible';
    let input = taskEdit.querySelector('input');
    let checkbox = taskEdit.querySelector('.custom-checkbox');
    input.value = "";
    checkbox.classList.remove('checkbox-checked');

    let save_button = taskEdit.querySelector('.save-button');
    save_button.addEventListener('click', saveTask, {once: true});
}

function removeTask(event) {
    let field = event.target.closest('.task-field');
    field.remove();
}

function completeTask(event) {
    let field = event.target.closest('.task-field');
    field.classList.toggle('task-completed');
}

function cancelEdition(event) {
    let edit = event.target.closest('.task-edit');
    let saveButton = edit.querySelector('.save-button');
    let newSaveButton = saveButton.cloneNode(true);
    edit.replaceChild(newSaveButton, saveButton);
    edit.style.visibility = 'hidden';
}

function saveTask(event) {
    let edit = event.target.closest('.task-edit');
    let list = edit.closest('#wrapper').querySelector('.task-list');

    let name = edit.querySelector('input').value;
    let checkbox = edit.querySelector('.custom-checkbox');
    let hiprio = checkbox.classList.contains('checkbox-checked');

    let new_field = makeField(name, hiprio);
    list.appendChild(new_field);

    edit.style.visibility = 'hidden';
}

function editTask(event) {
    event.stopPropagation();
    let field = event.target.closest('.task-field');
    let edit = field.closest('#wrapper').querySelector('.task-edit');
    let saveButton = edit.querySelector('.save-button');
    let newSaveButton = saveButton.cloneNode(true);
    edit.replaceChild(newSaveButton, saveButton);
    saveButton = newSaveButton;

    edit.style.visibility = 'visible';
    let input = edit.querySelector('input');
    input.value = field.querySelector('span').innerText;
    let checkbox = edit.querySelector('.custom-checkbox');
    advancedToggle(checkbox.classList, 'checkbox-checked', field.classList.contains('hiprio-task'));

    function applyEdition(event) {
        let edit = event.target.closest('.task-edit');
        let name = edit.querySelector('input').value;
        let checkbox = edit.querySelector('.custom-checkbox');
        let hiprio = checkbox.classList.contains('checkbox-checked');

        let nameField = field.querySelector('span');
        nameField.innerText = name;
        advancedToggle(field.classList, 'hiprio-task', hiprio);
        edit.style.visibility = 'hidden';
    }

    saveButton.addEventListener('click', applyEdition, {once: true});
}