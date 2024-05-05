const usersUrl = "http://localhost:5202/api/users";
const notesUrl = "http://localhost:5202/api/notes";

// UsuariolocalStorage
let userName = localStorage.getItem("user");
const modalUser = document.querySelector("#modalUser");

if (!userName) {
    const userInputBTN = document.querySelector(".inputUser-btn");
    const userInput = document.querySelector("#userInput");
    const modalUserBS = new bootstrap.Modal(modalUser);

    userInput.focus();
    modalUserBS.show();

    userInputBTN.addEventListener("click", () => {
        if (userInput.value != "") {
            localStorage.setItem("user", userInput.value);
            userName = userInput.value;
            greetings.textContent = `${dateName}, ${userName}`;
            modalUserBS.hide();
            
            // CreateUser
            datos = {
                name: userName,
            }
            
            fetch(usersUrl).then(r => r.json()).then((d) => {
                const userFind = d.find(u => u.name.toLowerCase() == userName.toLowerCase());
                
                if (!userFind) {
                    fetch(usersUrl, {
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(datos)
                    }).then(r => r.json()).then((newUser) => {
                        localStorage.setItem("userID", newUser.id);
                        console.log(localStorage.getItem("userID"));
                        location.reload();
                    });
                } else {
                    localStorage.setItem("userID", userFind.id);
                    console.log(localStorage.getItem("userID"));
                    location.reload();
                };
            });
        } else {
            alert("Ponga algo ps");
        }

    })
}

// SALUDO
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

greetings.textContent = `${dateName}, ${!userName ? "Usuario": userName}`;

// RECENT NOTES
const recentNotes = document.querySelector(".recentNotes-container");

const usersFetch = fetch(notesUrl)
.then(r => r.json())
.then((d) => {
    // Orden Recientes
    d.sort((a, b) => {
        const fechaA = new Date(a.dateModified);
        const fechaB = new Date(b.dateModified);

        // Comparación por año
        if (fechaA.getFullYear() !== fechaB.getFullYear()) {
            return fechaB.getFullYear() - fechaA.getFullYear();
        }

        // Comparación por mes
        if (fechaA.getMonth() !== fechaB.getMonth()) {
            return fechaB.getMonth() - fechaA.getMonth();
        }

        // Comparación por día
        if (fechaA.getDate() !== fechaB.getDate()) {
            return fechaB.getDate() - fechaA.getDate();
        }

        // Comparación por hora
        if (fechaA.getHours() !== fechaB.getHours()) {
            return fechaB.getHours() - fechaA.getHours();
        }

        // Comparación por minutos
        if (fechaA.getMinutes() !== fechaB.getMinutes()) {
            return fechaB.getMinutes() - fechaA.getMinutes();
        }

        // Comparación por segundos
        return fechaB.getSeconds() - fechaA.getSeconds();
    });

    d.forEach((note) => {
        // Div Nota
        const noteDiv = document.createElement("div");

        noteDiv.addEventListener("click", (e) => {
            if (!e.target.closest(".dropdown-center")) {
                if (note.userId == localStorage.getItem("userID")) {
                    localStorage.setItem("noteID", note.id);
                    location = "../../newnote/index.html";
                } else {
                    alert("No puedes editar una nota que no creaste")
                }
            }
        })

        noteDiv.classList.add("note");

        // Div Nota Titulo
        const noteTitle = document.createElement("div");
        noteTitle.classList.add("note-title");

        
        const noteTitleP = document.createElement("p");
        noteTitleP.textContent = note.title;
        noteTitle.appendChild(noteTitleP);

        // DropDown Options
        const dropdownCenter = document.createElement("div");
        dropdownCenter.className = "dropdown-center dropdown-options";

        const noteTitleOptions = document.createElement("div");
        noteTitleOptions.classList.add("note-title-options");
        noteTitleOptions.setAttribute("data-bs-toggle", "dropdown");
        noteTitleOptions.setAttribute("aria-expanded", "false");
        noteTitleOptions.innerHTML = `<svg class="note-title-options-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000000" d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"/></svg>`;
        
        const dropdownMenu = document.createElement("ul");
        dropdownMenu.className = "dropdown-menu dropdown-menu-dark";

        const dropdownMenuLi = document.createElement("li");
        const dropdownMenuBtn = document.createElement("button");
        dropdownMenuBtn.classList.add("dropdown-item");
        dropdownMenuBtn.textContent = "Eliminar Nota";

        dropdownMenuBtn.addEventListener("click", () => {
            if (note.userId == localStorage.getItem("userID")) {
                const confirmDelete = confirm(`¿Estás seguro de eliminar la nota "${note.title}"?`)
    
                if (confirmDelete) {
                    fetch(`${notesUrl}/${note.id}`, {
                        method: "DELETE"
                    }).then(
                        alert(`Se eliminó correctamente la nota "${note.title}"`),
                        location.reload()
                    );
                }
            } else {
                alert("No puedes Eliminar una nota que no creaste")
            }
        })

        dropdownMenuLi.appendChild(dropdownMenuBtn);
        dropdownMenu.appendChild(dropdownMenuLi);

        dropdownCenter.append(noteTitleOptions, dropdownMenu);
        noteTitle.appendChild(dropdownCenter);

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
        // noteFooterName.textContent = note.userId;

        // Nombre del ID
        fetch (usersUrl).then(r => r.json()).then((d) => {
            d.forEach((u) => {
                if (u.id === note.userId) {
                    noteFooterName.textContent = u.name;
                }

                if (note.userId == localStorage.getItem("userID")) {
                    noteFooterName.style = "color: #000; font-weight: 500";
                }
            })
        });

        const noteFooterDate = document.createElement("div");
        noteFooterDate.classList.add("note-footer-date");
        
        // Formatear Fecha
        const dateFormated = new Date(note.dateModified);
        
        // Hora
        const formatNumber = num => String(num).padStart(2, '0');

        const noteFooterTime = document.createElement("p");
        const noteFooterDateModified = document.createElement("p");
        noteFooterTime.textContent = `${formatNumber(dateFormated.getHours())}:${formatNumber(dateFormated.getMinutes())}:${formatNumber(dateFormated.getSeconds())}`;
        
        // Fecha
        const formatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        noteFooterDateModified.textContent = dateFormated.toLocaleDateString('es-ES', formatOptions);
        noteFooterDate.append(noteFooterTime, noteFooterDateModified);
        noteFooter.append(noteFooterName, noteFooterDate);

        noteDiv.append(noteTitle, noteBody, noteFooter);
        recentNotes.appendChild(noteDiv);
    });

    const newNoteContainer = document.querySelector('.newNote-container');
    recentNotes.appendChild(newNoteContainer);
});

// NewNote
const newNote = document.querySelector(".newNote");
newNote.addEventListener("click", () => {
    localStorage.removeItem("noteID");
})

// changeUser
const changeUser = document.querySelector('#changeUser');

changeUser.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});