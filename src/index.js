const keyboardEngKeys = [
    ['§£', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Enter'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\\'],
    ['Shift', '`', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Control', 'Alt', 'Meta', ' ', 'Meta', 'Alt', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
];
const keyboardRusKeys = [
    ['§£', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
    ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'Enter'],
    ['CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'ё'],
    ['Shift', ']', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/', 'Shift'],
    ['Control', 'Alt', 'Meta', ' ', 'Meta', 'Alt', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
];

let text = null;
let keyboard = null;
let language = "en";
let keyboardKeys = null;
let arrowsWrapper = null;
let resultString = ``;

window.onload = function () {
    createComponent();
    symbolClickHandler();
    keydownHandler();
}

function createComponent() {
    if (language === "en") {
        keyboardKeys = keyboardEngKeys;
    } else if (language === "ru") {
        keyboardKeys = keyboardRusKeys;
    }

    // Body
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("body");

    // Text
    text = document.createElement("section");
    text.classList.add("text");
    body.append(text);

    // Keyboard
    keyboard = document.createElement("section");
    keyboard.classList.add("keyboard");

    keyboardKeys.forEach((row) => {
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard__row");

        row.forEach((btn) => {
            let keyboardBtn = document.createElement("button");
            keyboardBtn.classList.add("keyboard__button");
            keyboardBtn.setAttribute("id", btn);

            if (btn === " ") {
                keyboardBtn.classList.add("keyboard__button_l");
            } else if (btn === "ArrowLeft") {
                keyboardBtn.innerHTML = '⇦';
            } else if (btn === "ArrowUp") {
                keyboardBtn.innerHTML = '⇧';
                arrowsWrapper = document.createElement("div");
                arrowsWrapper.classList.add("keyboard__arrows-wrapper");
                arrowsWrapper.append(keyboardBtn);
            } else if (btn === "ArrowDown") {
                keyboardBtn.innerHTML = '⇩';
                arrowsWrapper.append(keyboardBtn);
            } else if (btn === "ArrowRight") {
                keyboardBtn.innerHTML = '⇨';
            } else if (btn.length === 1) {
                keyboardBtn.innerHTML = btn;
                keyboardBtn.classList.add("keyboard__letter");
            } else if (btn.length === 2) {
                // Button primary symbol
                let btnSymbols = btn.split("");
                let btnPrimarySymbol = document.createElement("span");
                btnPrimarySymbol.innerHTML = btnSymbols[0];

                // Button secondary symbol
                let btnSecondarySymbol = document.createElement("span");
                btnSecondarySymbol.classList.add("keyboard__secondary-symbol");
                btnSecondarySymbol.innerHTML = btnSymbols[1];

                keyboardBtn.append(btnSecondarySymbol);
                keyboardBtn.append(btnPrimarySymbol);
            } else {
                btn === "Meta" ? keyboardBtn.innerHTML = "Command" : keyboardBtn.innerHTML = btn;
                keyboardBtn.classList.add("keyboard__button_m");
            }

            if (arrowsWrapper && keyboardBtn.id !== "ArrowRight") {
                keyboardRow.append(arrowsWrapper);
            } else {
                keyboardRow.append(keyboardBtn);
            }
        })

        keyboard.append(keyboardRow);
    })

    body.append(keyboard);
}

function symbolClickHandler() {
    keyboard.addEventListener("click", (e) => {
        highlightPressedBtn(e.target.id);
        addSymbolToText(e.target.id);
    })
}

function keydownHandler() {
    document.onkeydown = function (e) {
        console.log(e.code, e.key)
    }
    document.addEventListener("keydown", (e) => {
        highlightPressedBtn(e.key);
        if (e.key === "Meta") {
            changeLanguage();
        } else {
            addSymbolToText(e.key);
        }
    });
}

function changeLanguage() {
    const letters = document.querySelectorAll(".keyboard__letter");
    letters.forEach((letter) => {
        if (language === 'ru') {
            rerenderKeyboard(keyboardRusKeys, keyboardEngKeys, letter);
        } else {
            rerenderKeyboard(keyboardEngKeys, keyboardRusKeys, letter);
        }
    });

    if (language === 'ru') {
        language = 'en';
    } else {
        language = 'ru';
    }
}

function highlightPressedBtn(btn) {
    btn.length === 1 ? btn = document.getElementById(btn.toLowerCase()) : btn = document.getElementById(btn);
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

function rerenderKeyboard(keyboardPrev, keyboardNew, letter) {
    for (let i = 1; i < keyboardPrev.length - 1; i++) {
        let index = keyboardPrev[i].indexOf(letter.innerHTML);
        if (index !== -1) {
            letter.innerHTML = keyboardNew[i][index];
        }
    }
    letter.id = letter.innerHTML;
    return letter;
}