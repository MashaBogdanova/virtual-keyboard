let text = null;
let resultString = ``;

window.onload = function () {
    createComponent();
    keydownHandler();
}

function createComponent () {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("body");

    text = document.createElement("section");
    text.classList.add("text");
    body.append(text);

    const keyboard = document.createElement("section");
    keyboard.classList.add("keyboard");
    body.append(keyboard);
}

function keydownHandler () {
    document.addEventListener("keydown", (e) => {
        resultString += e.key;
        text.innerHTML = resultString;
    });
}