window.oncontextmenu = function(){return false};
document.addEventListener('keyup', keyboardHandler);

let inputs = document.querySelectorAll("input");
for (let input of inputs) {
    input.addEventListener('input', drawField);
}
inputs[0].dispatchEvent(new Event('input'));
let start_buttons = document.querySelectorAll('button');
for (let button of start_buttons) {
    button.addEventListener('click', drawField);
}


function getCell(field, x, y) {
    return field.children[y].children[x];
}

function drawField(event) {
    let interface = event.target.closest(".interface");
    let status = interface.querySelector('p.status');
    let clock = interface.querySelector('p.timer>span');
    clock.innerText = "0";
    status.style.color = "";
    status.innerText = "Игра не начата";


    let nInput = interface.querySelector('input[name="field-size"]');
    let mInput = interface.querySelector("input[name='bombs-number']");
    let n = +nInput.value;
    let m = +mInput.value;

    let wrapper = interface.parentElement;
    let field = wrapper.querySelector('.field');

    wrapper.addEventListener('mine.start', startGame);
    wrapper.addEventListener('mine.end', endGame);
    field.addEventListener('click', cellClicked);
    field.addEventListener('contextmenu', cellFlagged);
    field.addEventListener('mine.step', step);

    field.innerHTML = "";

    for (let i = 0; i < n; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        field.appendChild(row);
        for (let j = 0; j < n; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('x', j);
            cell.setAttribute('y', i);
            row.appendChild(cell);
        }
    }
}

function cellClicked(event) {
    if (!event.target.closest('.cell'))
        return;
    if (event.target.classList.contains('opened'))
        return;
    if (event.target.classList.contains('flagged'))
        return;
    let cell = event.target;
    let field = cell.closest(".field");
    let wrapper = field.closest("#wrapper");
    let x = +cell.getAttribute('x');
    let y = +cell.getAttribute('y');
    wrapper.dispatchEvent(new CustomEvent('mine.start', {detail: {x: x, y: y}}));
    field.dispatchEvent(new CustomEvent('mine.step', {detail: {x: x, y: y}}));
}

function cellFlagged(event) {
    if (!event.target.closest('.cell'))
        return;
    if (event.target.classList.contains('opened'))
        return;
    let cell = event.target;
    cell.classList.toggle('flagged');
}

function step(event) {
    let x = event.detail.x;
    let y = event.detail.y;
    let cell = event.target.querySelector(`.cell[x='${x}'][y='${y}']`);
    let wrapper = cell.closest("#wrapper");

    cell.classList.add('opened');

    if (cell.classList.contains('bombed')) {
        wrapper.dispatchEvent(new CustomEvent('mine.end', {detail: {result: 'lose'}}));
    }
    let notOpenedCells = document.querySelectorAll(".cell:not(.opened)");
    let mInput = wrapper.querySelector("input[name='bombs-number']");
    let m = +mInput.value;
    if (notOpenedCells.length === m) {
        wrapper.dispatchEvent(new CustomEvent('mine.end', {detail: {result: 'win'}}));
    }
}

function generateField(field, banned, m) {
    let x = banned.x;
    let y = banned.y;
    let n = field.querySelector('.row').childNodes.length;
    let bombs = 0;
    while (bombs !== m) {
        let i, j;
        i = Math.round(Math.random() * (n - 1));
        j = Math.round(Math.random() * (n - 1));
        let row = field.children[j];
        let cell = row.children[i];
        if ((!(i === x && j === y)) && (!cell.classList.contains('bombed'))) {
            cell.classList.add("bombed");
            bombs++;
        }
    }

    for (let i = 0; i < n; i++) {
        let row = field.children[i];
        for (let j = 0; j < n; j++) {
            let cell = row.children[j];

            if (!cell.classList.contains('bombed')) {
                let v = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (i + dx >= 0 && i + dx < n && j + dy >= 0 && j + dy < n) {
                            if (getCell(field, j + dy, i + dx).classList.contains('bombed')) {
                                v++;
                            }
                        }
                    }
                }
                if (v !== 0) {
                    cell.innerText = String(v);
                    cell.classList.add("c" + v);
                }
            }
        }
    }
}

function startTimer(interface) {
    let status = interface.querySelector('p.status');
    status.innerText = "Игра началась";
    status.style.color = "blue";
    let clocks = interface.querySelector('.timer>span');
    clocks.innerText = "0";
    clocks.addEventListener('increase-timer', increaseTimer);
    setTimeout(function() {clocks.dispatchEvent(new CustomEvent("increase-timer"))}, 1000);
}

function increaseTimer(event) {
    let clock = event.target;
    let sec = +clock.innerText;
    sec++;
    clock.innerText = String(sec);
    setTimeout(function() {clock.dispatchEvent(new CustomEvent("increase-timer"))}, 1000);
}


function startGame(event) {
    let wrapper = event.target;
    let field = wrapper.querySelector('.field');
    let interface = wrapper.querySelector('.interface');
    let mInput = interface.querySelector("input[name='bombs-number']");
    let m = +mInput.value;
    generateField(field, {x: event.detail.x, y: event.detail.y}, m);
    startTimer(interface);

    wrapper.removeEventListener('mine.start', startGame);
}

function endGame(event) {
    let result = event.detail.result;
    let wrapper = event.target;
    let field = wrapper.querySelector('.field');
    let interface = wrapper.querySelector(".interface");
    let clock = interface.querySelector("p.timer>span");
    let status=  interface.querySelector("p.status");
    if (result === "lose") {
        status.innerText = "Вы проиграли";
        status.style.color = "red";
    } else if (result === "win") {
        status.innerText = "Вы выйграли";
        status.style.color = 'green';
    }
    for (let row of field.children) {
        for (let cell of row.children) {
            cell.classList.add("opened");
        }
    }
    wrapper.removeEventListener('mine.end', endGame);
    field.removeEventListener('mine.step', step);
    field.removeEventListener('click', cellClicked);
    field.removeEventListener('contextmenu', cellFlagged);
    clock.removeEventListener('increase-timer', increaseTimer);
}

function keyboardHandler(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
            event.key === ' ' || event.key === 'Enter') {

        let field = document.querySelector('.field');
        let focused = field.querySelector('.cell.focused');

        if (!focused) {
            let cell = field.firstChild.firstChild;
            cell.classList.add('focused');
            return;
        }

        if (event.key === ' ' || event.key === 'Enter') {
            if (event.ctrlKey) {
                focused.dispatchEvent(new Event("contextmenu", {bubbles: true}));
            } else {
                focused.dispatchEvent(new Event("click", {bubbles: true}));
            }
            return;
        }


        let x = +focused.getAttribute('x');
        let y = +focused.getAttribute('y');
        let n = field.children.length;
        if (event.key === 'ArrowUp') {
            y = (y + n - 1) % n;
        } else if (event.key === 'ArrowDown') {
            y = (y + 1) % n;
        } else if (event.key === 'ArrowLeft') {
            x = (x + n - 1) % n;
        } else if (event.key === 'ArrowRight') {
            x = (x + 1) % n;
        }
        let new_cell = field.querySelector(`.cell[x='${x}'][y='${y}']`);
        new_cell.classList.add('focused');
        focused.classList.remove('focused');
    }
}

