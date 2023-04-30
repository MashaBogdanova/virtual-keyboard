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
const specialSymbols = {
    "£": "§",
    "!": "1",
    "@": "2",
    "#": "3",
    "$": "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    "_": "-",
    "+": "="
}

let text = null;
let keyboard = null;
let keyboardKeys = null;
let arrowsWrapper = null;
let isUpperCase = false;

window.onload = function () {
    setLanguage();
    createComponent();
    symbolClickHandler();
    keydownHandler();
}

function setLanguage() {
    !localStorage.getItem("keyboardLanguage") && localStorage.setItem("keyboardLanguage", "en");
    localStorage.getItem("keyboardLanguage") === "en"
        ? keyboardKeys = keyboardEngKeys
        : keyboardKeys = keyboardRusKeys;
}

function createComponent() {
    // Body
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("body");

    // Text
    text = document.createElement("textarea");
    text.classList.add("text");
    text.setAttribute("autofocus", "true");
    // text.setAttribute("readonly", "true");
    body.append(text);

    // Change language message
    let message = document.createElement("section");
    message.innerHTML = "Press Control + Space to change the language";
    message.classList.add("change-language-message");
    body.append(message);

    // Keyboard
    keyboard = document.createElement("section");
    keyboard.classList.add("keyboard");

    keyboardKeys.forEach((row) => {
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard__row");

        row.forEach((btn) => {
            let keyboardBtn = document.createElement("button");
            keyboardBtn.classList.add("keyboard__button");
            btn.length === 2
                ? keyboardBtn.setAttribute("id", btn[0])
                : keyboardBtn.setAttribute("id", btn);

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
        console.log(e.target.id)
        highlightPressedBtn(e.target.id);
        addSymbolToText(e, e.target.id);
    })
}

function keydownHandler() {
    document.addEventListener("keyup", (e) => {
        if (e.key === 'CapsLock') {
            e.preventDefault();
            highlightPressedBtn(e.key);
            addSymbolToText(e, e.key);
        }
    })
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        highlightPressedBtn(e.key);
        if (e.ctrlKey && e.key === " ") {
            changeLanguage();
        } else {
            addSymbolToText(e, e.key);
        }
    });
}

function changeLanguage() {
    const letters = document.querySelectorAll(".keyboard__letter");
    letters.forEach((letter) => {
        if (localStorage.getItem("keyboardLanguage") === 'en') {
            rerenderKeyboardOnLanguageChange(keyboardEngKeys, keyboardRusKeys, letter);
        } else {
            rerenderKeyboardOnLanguageChange(keyboardRusKeys, keyboardEngKeys, letter);
        }
    });
    localStorage.getItem("keyboardLanguage") === "en"
        ? localStorage.setItem("keyboardLanguage", "ru")
        : localStorage.setItem("keyboardLanguage", "en");
}

function highlightPressedBtn(btnKey) {
    let btnElem = null;
    if (btnKey.length === 1) {
        if (btnKey.match(/[£!@#$%^&*()_+]/)) {
            btnKey = specialSymbols[btnKey];
        }
        btnElem = document.getElementById(btnKey);
    } else {
        btnElem = document.getElementById(btnKey);
    }

    btnElem.classList.add("keyboard__button_pressed");
    setTimeout(() => {
        btnElem.classList.remove("keyboard__button_pressed");
    }, 200)
}

function addSymbolToText(e, key) {
    console.log(key)
    if (key.length === 1) {
        text.value += key;
    } else if (key === "Backspace") {
        text.value = text.value.slice(0, -1);
    } else if (key === "Enter") {
        text.value += "\n";
    } else if (key === "CapsLock") {
        debugger
        rerenderKeyboardOnCapsLock();
        isUpperCase = !isUpperCase;
    }
}

function rerenderKeyboardOnLanguageChange(keyboardPrev, keyboardNew, letter) {
    for (let i = 1; i < keyboardPrev.length - 1; i++) {
        let index = keyboardPrev[i].indexOf(letter.innerHTML);
        if (index !== -1) {
            letter.innerHTML = keyboardNew[i][index];
        }
    }
    letter.id = letter.innerHTML;
    return letter;
}

function rerenderKeyboardOnCapsLock() {
    for (let elem of document.querySelectorAll(".keyboard__letter")) {
        if (isUpperCase) {
            elem.innerHTML = elem.innerHTML.toLowerCase();
        } else {
            elem.innerHTML = elem.innerHTML.toUpperCase();
        }
        elem.id = elem.innerHTML;
    }
}