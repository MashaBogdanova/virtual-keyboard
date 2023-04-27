const keyboardEngKeys = [
    ['§', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Enter'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\\'],
    ['Shift', '`', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ArrowUp', 'Shift'],
    ['Control', 'Alt', 'Meta', ' ', 'Meta', 'Alt', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
]

let text = null;
let keyboard = null;
let resultString = ``;

window.onload = function () {
    createComponent();
    symbolClickHandler();
    keydownHandler();
}

function createComponent () {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("body");

    // Text
    text = document.createElement("section");
    text.classList.add("text");
    body.append(text);

    // Keyboard
    keyboard = document.createElement("section");
    keyboard.classList.add("keyboard");

    keyboardEngKeys.forEach((row) => {
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard__row");

        row.forEach((btn) => {
            let keyboardBtn = document.createElement("button");
            keyboardBtn.classList.add("keyboard__button");
            keyboardBtn.setAttribute("id", btn);
            keyboardBtn.innerHTML = btn;
            keyboardRow.append(keyboardBtn);
        })

        keyboard.append(keyboardRow);
    })

    body.append(keyboard);
}

function symbolClickHandler() {
    keyboard.addEventListener("click", (e) => {
        highlightPressedBtn(e.target.id.length === 1 ? document.getElementById(e.target.id.toLowerCase()) : document.getElementById(e.target.id));
        addSymbolToText(e.target.id);
    })
}

function keydownHandler () {
    let row = [];
    document.onkeydown = function (e) {
        row.push(e.key)
        console.log(row)
    }
    document.addEventListener("keydown", (e) => {
        highlightPressedBtn(e.key.length === 1 ? document.getElementById(e.key.toLowerCase()) : document.getElementById(e.key));
        addSymbolToText(e.key);
    });
}

function highlightPressedBtn(btn) {
    btn.classList.add("keyboard__button_pressed");
    setTimeout(() => {
        btn.classList.remove("keyboard__button_pressed");
    }, 200)
}

function addSymbolToText(symb) {
    if (symb.length === 1) {
        resultString += symb;
        text.innerHTML = resultString;
    } else if (symb === "Backspace") {
        resultString = resultString.slice(0, -1);
        text.innerHTML = resultString;
    }
}