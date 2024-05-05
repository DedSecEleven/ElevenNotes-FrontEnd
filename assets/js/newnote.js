const notesUrl = "http://192.168.1.19:5202/api/notes";

const user = localStorage.getItem("userID");
if (!user) {
    location.href = "../../index.html";
}

const inputTile = document.querySelector(".inputTitle");
const inputP = document.querySelector(".inputP");

inputTile.addEventListener("input", () => {
    inputTile.style.height = "auto";
    inputTile.style.height = inputTile.scrollHeight + "px";
})

inputP.addEventListener("input", () => {
    inputP.style.height = "auto";
    inputP.style.height = inputP.scrollHeight + "px";
})

const saveNote = document.querySelector("#saveNote");

saveNote.addEventListener("click", () => {
    let date = new Date();
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    date = date.toISOString();

    datos = {
        title: inputTile.value,
        content: inputP.value,
        userID: user,
        dateModified: date
    }

    fetch(notesUrl, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(datos)
    }).then(r => r.json()).then((newNote) => {
        console.log(newNote.dateModified);
        alert(`La nota "${newNote.title}" se creo correctamente`)
        location.href = "../../index.html";
    });
});