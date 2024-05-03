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

const recentNotes = document.querySelector(".recentNotes-container");

const usersUrl = "http://localhost:5202/api/users";
const notesUrl = "http://localhost:5202/api/notes";

const usersFetch = fetch(notesUrl)
.then(r => r.json())
.then((d) => {
    d.forEach((note) => {
        console.log(note.title);
        console.log(note.content);

        // Div Nota
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");

        // Div Nota Titulo
        const noteTitle = document.createElement("div");
        noteTitle.classList.add("note-title");

        const noteTitleP = document.createElement("p");
        noteTitleP.textContent = note.title;
        noteTitle.appendChild(noteTitleP);

        // Div Nota Body
        const noteBody = document.createElement("div");
        noteBody.classList.add("note-body");

        const noteBodyP = document.createElement("p");
        noteBodyP.textContent = note.content;
        noteBody.appendChild(noteBodyP);

        // Div Nota Footer
        const noteFooter = document.createElement("div");
        noteFooter.classList.add("note-footer");

        const noteFooterName = document.createElement("p");
        noteFooterName.textContent = note.userId;

        // Nombre del ID
        fetch (usersUrl).then(r => r.json()).then((d) => {
            d.forEach((u) => {
                if (u.id === note.userId) {
                    noteFooterName.textContent = u.name;
                }
            })
        });

        const noteFooterDate = document.createElement("p");
        
        // Formatear Fecha
        const formatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const dateFormated = new Date(note.dateModified);

        noteFooterDate.textContent = dateFormated.toLocaleDateString('es-ES', formatOptions);
        noteFooter.append(noteFooterName, noteFooterDate);

        noteDiv.append(noteTitle, noteBody, noteFooter);
        recentNotes.appendChild(noteDiv);
    });

    
});