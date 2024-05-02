const date = new Date();
let dateTime = date.getHours();
const greetings = document.querySelector("#greetingsName");
let dateName;

if (dateTime >= 0 && dateTime < 12) {
    dateName = "Buenos días";
} else if (dateTime >= 12 && dateTime < 19) {
    dateName = "Buenas tardes";
} else {
    dateName = "Buenas noches";
}

greetings.textContent = `${dateName}, ${greetings.textContent}`;