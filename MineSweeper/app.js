function drawField(event) {
    let m_input = event.target.previousElementSibling;
    let n_input = m_input.previousElementSibling;
    let n = n_input.value;

    let fieldDiv = n_input.parentElement.previousElementSibling.querySelector(".field");
    fieldDiv.innerHTML = "";

    for (let i = 0; i < n; i++) {
        let fieldRow = document.createElement("div");
        fieldRow.classList.add("row");
        fieldDiv.appendChild(fieldRow);
        for (let j = 0; j < n; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.animationDelay = String(i);
            cell.animationDuration = String(j);
			cell.removeEventListener('click', drawField);
            cell.addEventListener('click', cellClicked);
            cell.addEventListener('contextmenu', cellFlagged);
            cell.addEventListener('mine.step', step);
            fieldRow.appendChild(cell);
        }
    }
}

function cellClicked(event) {
    let cell = event.target;
    let row = cell.parentNode;
    let field = row.parentNode;
    let x, y;
    for (x = 0; row.children[x] !== cell; x++);
    for (y = 0; field.children[y] !== row; y++);

    let opened_cells = field.querySelectorAll(".opened");
    if (opened_cells.length === 0) {
        let cEvent = new CustomEvent("mine.start", {detail: {x: x, y: y}});
        field.dispatchEvent(cEvent);
    }
    cell.dispatchEvent(new CustomEvent("mine.step", {detail: {x: x, y: y, click: true}}));
}

function cellFlagged(event) {
    let cell = event.target;
    cell.classList.toggle('flagged');
    if (cell.classList.contains('flagged')) {
        cell.removeEventListener('click', cellClicked);
    } else {
        cell.addEventListener('click', cellClicked);
    }
    return false;
}

function getCell(field, i, j) {
    return field.querySelectorAll(".row")[i].querySelectorAll(".cell")[j];
}

function openCell(cell) {
    cell.classList.add('opened');
    cell.removeEventListener('mine.step', step);
    cell.removeEventListener('contextmenu', cellFlagged);
}

function start(event) {
    let n, m;
    let x, y;
    let field = event.target;
    let settings = field.parentNode.parentNode.querySelector('.settings');
    n = settings.children[0].value;
    m = +settings.children[1].value;
    x = event.detail.x;
    y = event.detail.y;

    let bombs = 0;
    while (bombs !== m) {
        let i = Math.round(Math.random() * (n - 1));
        let j = Math.round(Math.random() * (n - 1));
        let cell = getCell(field, i, j);
        if ((i !== y) && (j !== x) && (!cell.classList.contains('bombed'))) {
            cell.classList.add('bombed');
            bombs += 1;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let cell = getCell(field, i, j);
            if (cell.classList.contains('bombed'))
                continue;
            let counter = 0;
            for (let dx = -1; dx < 2; dx++) {
                for (let dy = -1; dy < 2; dy++) {
                    if (i + dx >= 0 && i + dx < n && j + dy >= 0 && j + dy < n) {
                        let c_cell = getCell(field, i + dx, j + dy);
                        if (c_cell.classList.contains('bombed')) {
                            counter++;
                        }
                    }
                }
            }
            cell.classList.add('c' + counter);
            if (counter)
                cell.innerHTML = counter;
        }
    }
}

function step(event) {
    let cell = event.target;
    let x = event.detail.x;
    let y = event.detail.y;
    let n = event.target.parentNode.children.length;
    let field = cell.parentNode.parentNode;
    if (cell.innerText === "" && !cell.classList.contains('bombed')) {
        openCell(cell);
        if (x - 1 >= 0) {
            let tmp_cell = getCell(field, x - 1, y);
            if (!tmp_cell.classList.contains('opened'))
                tmp_cell.dispatchEvent(new CustomEvent('mine.step', {detail: {x: x - 1, y: y}}));
        }
        if (x + 1 < n) {
            let tmp_cell = getCell(field, x + 1, y);
            if (!tmp_cell.classList.contains('opened'))
                tmp_cell.dispatchEvent(new CustomEvent('mine.step', {detail: {x: x + 1, y: y}}));
        }
        if (y - 1 >= 0) {
            let tmp_cell = getCell(field, x, y - 1);
            if (!tmp_cell.classList.contains('opened'))
                tmp_cell.dispatchEvent(new CustomEvent('mine.step', {detail: {x: x, y: y - 1}}));
        }
        if (y + 1 < n) {
            let tmp_cell = getCell(field, x, y + 1);
            if (!tmp_cell.classList.contains('opened'))
                tmp_cell.dispatchEvent(new CustomEvent('mine.step', {detail: {x: x, y: y + 1}}));
        }
    } else if (cell.innerText !== "") {
        openCell(cell);
    } else if (event.detail.click) {
        openCell(cell);
        if (cell.classList.contains('bombed')) {
            field.dispatchEvent(new CustomEvent('mine.end'));
        }
    }
    let closed_cells = field.querySelectorAll('.cell:not(.opened), .cell.flagged');
    let bombed_cells = field.querySelectorAll('.cell.bombed');
    if (closed_cells.length === bombed_cells.length) {
        field.dispatchEvent(new CustomEvent('mine.end'));
    }
}

function end(event) {
    let field = event.target;
    let cells = field.querySelectorAll('.cell');
    for (let cell of cells) {
        cell.classList.add('opened');
    }
}



let startButtons = document.querySelectorAll('.start-button');
for (let button of startButtons) {
    button.addEventListener('click', drawField);
}

let fields = document.querySelectorAll(".field");
for (let field of fields) {
    field.addEventListener('mine.start', start);
    field.addEventListener('mine.end', end);
}

window.oncontextmenu = function () {
    return false;
};

