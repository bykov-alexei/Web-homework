function find_input(form, name) {
    return form.querySelectorAll(`.field input[name^='${name}']`);
}

function apply(form_id) {
    let form = document.getElementById(form_id);

    let company = find_input(form, 'company-name')[0].value;

    let person_input = find_input(form, 'person-name')[0];
    let person = person_input.value;
    let person_align =  Array.prototype.slice.call(person_input.parentNode.querySelector(".align .selected").classList).
         filter(s => (s.substring(0, "align".length) === "align"))[0].split('-')[1];
    let person_size = person_input.parentNode.querySelector(".size .selected").innerText;
    let person_color = window.getComputedStyle(person_input.parentNode.querySelector(".color-switch .color-selected")).borderRightColor;

    let position_input = find_input(form, 'position')[0];
    let position = position_input.value;
    let position_align = Array.prototype.slice.call(position_input.parentNode.querySelector(".align .selected").classList).
        filter(s => (s.substring(0, "align".length) === "align"))[0].split('-')[1];
    let position_size = position_input.parentNode.querySelector(".size .selected").innerText;
    let position_color = window.getComputedStyle(position_input.parentNode.querySelector('.color-switch .color-selected')).borderRightColor;

    let phones = Array.prototype.slice.call(find_input(form, 'phone-number')).map(input => input.value);
    let email_input = find_input(form, 'email')[0];
    let email_checkbox = email_input.closest('.field').querySelector('span.checkmark');
    let email = email_input.value;
    let address_input = find_input(form, 'address')[0];
    let address_checkbox = address_input.closest('.field').querySelector('span.checkmark');
    let address = address_input.value;

    let company_display = form.querySelector(".display p.company-name");
    let name_display = form.querySelector(".display p.person-name");
    let position_display = form.querySelector(".display p.position");
    let phones_display = form.querySelectorAll(".display .additional")[0];
    let email_display = form.querySelectorAll(".display .additional")[1];
    let address_display = form.querySelectorAll(".display .additional")[2];

    company_display.innerText = company;

    name_display.innerText = person;
    name_display.style.textAlign = person_align;
    name_display.style.fontSize = person_size;
    name_display.style.color = person_color;

    position_display.innerText = position;
    position_display.style.textAlign = position_align;
    position_display.style.fontSize = position_size;
    position_display.style.color = position_color;

    phones_display.innerHTML = "";
    for (let phone of phones) {
        let elem = document.createElement("p");
        elem.innerText = phone;
        phones_display.appendChild(elem);
    }

    email_display.innerText = email;
    email_display.style.display = (window.getComputedStyle(email_checkbox, ":after").content !== "none") ? 'inline-block' : 'none';
    address_display.innerText = address;
    address_display.style.display = (window.getComputedStyle(address_checkbox, ":after").content !== "none") ? 'inline-block': 'none';
}

function onColorChange(event) {
    let colors_container = event.target.parentNode;
    for (let children of colors_container.children) {
        children.classList.remove("color-selected");
    }
    event.target.classList.add("color-selected");
}

function onOptionChange(event) {
    let switch_container = event.target.parentNode;
    for (let option of switch_container.children) {
        option.classList.remove("selected");
    }
    event.target.classList.add('selected');
}

function addPhone(event) {
    let next_field = event.target.closest('div.field');
    let field = next_field.previousElementSibling;
    let editor = next_field.parentNode;
    let new_field = field.cloneNode(true);
    editor.insertBefore(new_field, next_field);
    let dbuttons = document.querySelectorAll('.remove-button');
    for (let button of dbuttons) {
        button.addEventListener('click', removePhone);
        button.style.display = 'inline-block';
        let input = button.previousElementSibling;
        input.style.width = '222px';
    }
}

function removePhone(event) {
    let container = event.target.closest('.field');
    let editor = container.parentNode;

    container.remove();
    let buttons = editor.parentNode.querySelectorAll(".field > .remove-button");
    if (buttons.length === 1) {
        buttons[0].style.display = 'none';
        let input = buttons[0].previousElementSibling;
        input.style.width = '255px';
    }
}
let color_options = document.querySelectorAll(".color-option");
for (let option of color_options) {
    option.addEventListener("click", onColorChange);
}

let options = document.querySelectorAll(".option");
for (let option of options) {
    option.addEventListener('click', onOptionChange);
}

let abuttons = document.querySelectorAll(".add-button");
for (let button of abuttons) {
    button.addEventListener('click', addPhone);
}

let dbuttons = document.querySelectorAll('.remove-button');
for (let button of dbuttons) {
    button.addEventListener('click', removePhone);
}
