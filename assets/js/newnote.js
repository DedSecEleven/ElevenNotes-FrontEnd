const notesUrl = "http://localhost:5202/api/notes";
const noteID = localStorage.getItem('noteID');

// NotyF
var notyf = new Notyf();
var notyfServer = new Notyf({
    duration: 10000
});

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
    if (inputTile.value != "" && inputP.value != "") {
        let date = new Date();
        date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        date = date.toISOString();
    
        datos = {
            id: noteID,
            title: inputTile.value,
            content: inputP.value,
            userID: user,
            dateModified: date,
        }
    
        if (noteID) {
            notyf.success("La nota se actualizó correctamente");
            fetch(`${notesUrl}/${noteID}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(datos)
            }).then(r => r.json()).then((noteEdit) => {
                setTimeout(() => {
                    location.href = "../../index.html";
                },2000)
            });
        } else {
            datos = {
                title: inputTile.value,
                content: inputP.value,
                userID: user,
                dateModified: date,
            }
    
            notyf.success("La nota se creo correctamente");
            fetch(notesUrl, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(datos)
            }).then(r => r.json()).then((newNote) => {
                setTimeout(() => {
                    location.href = "../../index.html";
                },2000)
            });
        }
    } else {
        notyf.error("La nota no puede estar vacía");
    }
});

// EditNote
if (noteID) {
    fetch(`${notesUrl}/${noteID}`).then(r => r.json())
    .then((note) => {
        inputTile.value = note.title;
        inputP.value = note.content;
    });
}

const navItem = document.querySelectorAll('.nav-item');
navItem.forEach((item) => {
    item.addEventListener('click', () => {
        notyf.error("Coming soon...");
    });
})