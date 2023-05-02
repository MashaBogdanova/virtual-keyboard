const keyboardEngKeys = [
    ['§£', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Enter'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\\'],
    ['ShiftLeft', '`', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
    ['Control', 'AltLeft', 'MetaLeft', ' ', 'MetaRight', 'AltRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
];
const keyboardRusKeys = [
    ['§<', '1!', '2"', '3№', '4%', '5:', '6,', '7.', '8;', '9(', '0)', '-_', '=+', 'Backspace'],
    ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'Enter'],
    ['CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'ё'],
    ['ShiftLeft', ']', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/', 'ShiftRight'],
    ['Control', 'AltLeft', 'MetaLeft', ' ', 'MetaRight', 'AltRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
];
const specialSymbolsEn = {
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
};
const specialSymbolsRu = {
    "<": "§",
    "!": "1",
    '"': "2",
    "№": "3",
    "%": "4",
    ":": "5",
    ",": "6",
    ".": "7",
    ";": "8",
    "(": "9",
    ")": "0",
    "_": "-",
    "+": "="
};

let text = null;
let keyboard = null;
let keyboardKeys = null;
let arrowsWrapper = null;
let isUpperCase = false;
let keyboardLanguage = null;

window.onload = function () {
    setLanguage();
    createComponent();
    symbolClickHandler();
    keydownHandler();
}

function setLanguage() {
    keyboardLanguage = localStorage.getItem("keyboardLanguage") || "en";
    keyboardKeys = keyboardLanguage === "en" ? keyboardEngKeys : keyboardRusKeys;
}
function createComponent() {
    // Body
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("body");

    // Text
    text = document.createElement("textarea");
    text.classList.add("text");
    text.setAttribute("autofocus", "true");
    body.append(text);

    // System and language message
    let message = document.createElement("section");
    message.innerHTML = `<div>This keyboard has been implemented for macOS</div>
                        <div>Press Shift + Space to change the language</div>`;
    message.classList.add("system-language-message");
    body.append(message);

    // Keyboard
    keyboard = document.createElement("section");
    keyboard.classList.add("keyboard");
    for (const row of keyboardKeys) {
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard__row");
        for (const btn of row) {
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
                const [primary, secondary] = btn.split("");
                keyboardBtn.innerHTML = `<span>${primary}</span><span class="keyboard__secondary-symbol">${secondary}</span>`;
            } else {
                if (btn === "MetaLeft" || btn === "MetaRight") {
                    keyboardBtn.innerHTML = "Command";
                } else if (btn === "ShiftLeft" || btn === "ShiftRight") {
                    keyboardBtn.innerHTML = "Shift";
                } else if (btn === "AltLeft" || btn === "AltRight") {
                    keyboardBtn.innerHTML = "Option";
                } else {
                    keyboardBtn.innerHTML = btn;
                }
                keyboardBtn.classList.add("keyboard__button_m");
            }

            if (arrowsWrapper && keyboardBtn.id !== "ArrowRight") {
                keyboardRow.append(arrowsWrapper);
            } else {
                keyboardRow.append(keyboardBtn);
            }
        }
        keyboard.append(keyboardRow);
    }
    body.append(keyboard);
}

function symbolClickHandler() {
    keyboard.addEventListener("click", (e) => {
        highlightPressedBtn(e.target.closest(".keyboard__button").id);
        addSymbolToText(e, e.target.closest(".keyboard__button").id);
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
        console.log(e.key)
        e.preventDefault();
        highlightPressedBtn(e.key, e.code);
        if (e.shiftKey && e.key === " ") {
            changeLanguage();
        } else {
            addSymbolToText(e, e.key);
        }
    });
}

function changeLanguage() {
    const letters = document.querySelectorAll(".keyboard__letter");
    for (const button of letters) {
        if (keyboardLanguage === 'en') {
            rerenderKeyboardOnLanguageChange(keyboardEngKeys, keyboardRusKeys, button);
        } else {
            rerenderKeyboardOnLanguageChange(keyboardRusKeys, keyboardEngKeys, button);
        }
    }
    keyboardLanguage = keyboardLanguage === "en" ? "ru" : "en";
    localStorage.setItem("keyboardLanguage", keyboardLanguage);
}
function highlightPressedBtn(symbol, btnCode) {
    let btnElem = null;
    if (symbol.length === 1) {
        if (keyboardLanguage === "en" && symbol.match(/[£!@#$%^&*()_+]/)) {
            symbol = specialSymbolsEn[symbol];
        } else if (keyboardLanguage === "ru" && symbol.match(/[<!"№%:,.;()_+]/)) {
            symbol = specialSymbolsRu[symbol];
        }
        isUpperCase
            ? btnElem = document.getElementById(symbol)
            : btnElem = document.getElementById(symbol.toLowerCase());

    } else {
        if (btnCode === "ShiftLeft" || btnCode === "ShiftRight" || btnCode === "AltLeft"
            || btnCode === "AltRight" || btnCode === "MetaLeft" || btnCode === "MetaRight") {
            btnElem = document.getElementById(btnCode);
        } else {
            btnElem = document.getElementById(symbol);
        }
    }

    btnElem.classList.add("keyboard__button_pressed");
    setTimeout(() => {
        btnElem.classList.remove("keyboard__button_pressed");
    }, 200)
}
function addSymbolToText(e, key) {
    if (key.length === 1) {
        if (e.shiftKey && key) {
            text.value += key.toUpperCase();
        } else {
            text.value += key;
        }
    } else if (key === "Backspace") {
        text.value = text.value.slice(0, -1);
    } else if (key === "Enter") {
        text.value += "\n";
    } else if (key === "CapsLock") {
        rerenderKeyboardOnCapsLock();
        isUpperCase = !isUpperCase;
    } else if (key === "Tab") {
        text.value += "\t";
    } else if (key === "ArrowLeft") {
        text.value += "⇦";
    } else if (key === "ArrowUp") {
        text.value += '⇧';
    } else if (key === "ArrowDown") {
        text.value += '⇩';
    } else if (key === "ArrowRight") {
        text.value += '⇨';
    }
}
function rerenderKeyboardOnLanguageChange(keyboardPrev, keyboardNew, elem) {
    for (let i = 1; i < keyboardPrev.length - 1; i++) {
        let index = keyboardPrev[i].indexOf(elem.id);
        if (index !== -1 && elem.id.length === 1) {
            elem.innerHTML = keyboardNew[i][index];
            elem.id = elem.innerHTML;
        }
    }
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