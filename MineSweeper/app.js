function drawField(event) {
    let settings = event.target.parentNode;
    let field = settings.parentNode.parentNode.querySelector('.field');

    let n, m;
    n = +settings.children[0].querySelector('input').value;
    m = +settings.children[1].querySelector('input').value;

    field.setAttribute('n', n);
    field.setAttribute('m', m);

    field.innerHTML = "";
    for (let i = 0; i < n; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        field.appendChild(row);

        for (let j = 0; j < n; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('x', j);
            cell.setAttribute('y', i);
            cell.addEventListener('click', cellClick);
            cell.addEventListener('mine.step', step);
            row.appendChild(cell);
        }
    }
}


function generateField(event) {
    let field = event.target;
    let x = +event.detail.x;
    let y = +event.detail.y;
    let n = +field.getAttribute('n');
    let m = +field.getAttribute('m');

    let bombs = 0;
    while (bombs !== m) {
        let i, j;
        i = Math.round(Math.random() * (n - 1));
        j = Math.round(Math.random() * (n - 1));
        let row = field.children[j];
        let cell = row.children[i];
        if ((!(i === x && j === y)) && (!cell.classList.contains('bombed'))) {
            cell.classList.add("bombed");
            cell.classList.add("opened");
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
                            if (getCell(field, i + dx, j + dy).classList.contains('bombed')) {
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

function getCell(field, i, j) {
    let row = field.children[i];
    return row.children[j];
}

function openCell(cell) {
    let x = +cell.getAttribute('x');
    let y = +cell.getAttribute('y');
    console.log(x + " " + y);
    cell.classList.add("opened");
    if (cell.innerText === "") {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (!cell.classList.contains('bombed') && !cell.classList.contains('opened')) {
                    openCell(getCell(field, x + dx, y + dy));
                }
            }
        }
    }
}

function step(event) {
    let cell = event.target;
    let x, y;
    // x = cell.getAttribute('x');
    // y = cell.getAttribute('y');
    openCell(cell);

}

function cellClick(event) {
    let cell = event.target;
    let field = cell.parentNode.parentNode;
    let x = cell.getAttribute('x');
    let y = cell.getAttribute('y');
    if (field.querySelectorAll('.bombed').length === 0) {
        field.dispatchEvent(new CustomEvent("mine.start", {detail:{x:x, y:y}}));
    }

    let mEvent = new CustomEvent('mine.step');
    mEvent.isTrusted = true;
    cell.dispatchEvent(mEvent);

    openCell(cell);
    if (cell.classList.contains('bombed')) {
        field.dispatchEvent(new CustomEvent('mine.end', {detail: {result: "lose"}}));
    }
}

let start_buttons = document.querySelectorAll('button');
for (let start_button of start_buttons) {
    start_button.addEventListener('click', drawField);
}

let field = document.querySelector('.field');
field.addEventListener('mine.start', generateField);
