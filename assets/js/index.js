const usersUrl = "http://localhost:5202/api/users";
const notesUrl = "http://localhost:5202/api/notes";

// NotyF
var notyf = new Notyf();
var notyfServer = new Notyf({
    duration: 10000
});

// DarkMode
const darkmode = document.querySelector(".darkmode");
darkmode.addEventListener("click", () => {
    notyf.error("Coming soon...");
});

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
                        notyf.success('Se ha creado un nuevo usuario');
                        setTimeout(() => {
                            location.reload()
                        },2000)
                    });
                } else {
                    localStorage.setItem("userID", userFind.id);
                    console.log(localStorage.getItem("userID"));
                    notyf.success('Has ingresado correctamente');
                    setTimeout(() => {
                        location.reload()
                    },2000)
                };
            }).catch(e => {
                notyfServer.error('Hubo un error en el servidor')
            });
        } else {
            notyf.error('Ponga algo ps');
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
        noteDiv.classList.add("note");

        noteDiv.addEventListener("click", (e) => {
            if (!e.target.closest(".dropdown-center")) {
                if (note.userId == localStorage.getItem("userID")) {
                    localStorage.setItem("noteID", note.id);
                    localStorage.setItem("noteHide", note.hide);
                    location = "../../editor/index.html";
                } else {
                    notyf.error("No puedes editar una nota que no creaste");
                }
            }
        })


        // Div Nota Titulo
        const noteTitle = document.createElement("div");
        noteTitle.classList.add("note-title");

        
        const noteTitleP = document.createElement("p");
        noteTitleP.textContent = note.title;
        noteTitle.appendChild(noteTitleP);

        // Icon Notas Ocultas
        const noteHideIconDiv = document.createElement("div");
        noteHideIconDiv.classList.add("note-hide");
        noteHideIconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="#00000090" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"/></svg>`;
        
        if (note.hide) {
            noteTitle.appendChild(noteHideIconDiv);
        }

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

        const dropdownMenuLiDelete = document.createElement("li");
        const editordropdownMenuBtnDelete = document.createElement("button");
        editordropdownMenuBtnDelete.classList.add("dropdown-item");
        editordropdownMenuBtnDelete.textContent = "Eliminar Nota";

        editordropdownMenuBtnDelete.addEventListener("click", () => {
            if (note.userId == localStorage.getItem("userID")) {
                const confirmDelete = confirm(`¿Estás seguro de eliminar la nota "${note.title}"?`)
    
                if (confirmDelete) {
                    fetch(`${notesUrl}/${note.id}`, {
                        method: "DELETE"
                    }).then(
                        notyf.success(`Se eliminó correctamente la nota "${note.title}"`),
                        setTimeout(() => {
                            location.reload()
                        },2000)
                    );
                }
            } else {
                notyf.error("No puedes eliminar una nota que no creaste");
            }
        })

        dropdownMenuLiDelete.appendChild(editordropdownMenuBtnDelete);

        const dropdownMenuLiHide = document.createElement("li");
        const editordropdownMenuBtnHide = document.createElement("button");
        editordropdownMenuBtnHide.classList.add("dropdown-item");

        if (note.hide) {
            editordropdownMenuBtnHide.textContent = "Mostrar Nota";
        } else {
            editordropdownMenuBtnHide.textContent = "Ocultar Nota";
        }

        editordropdownMenuBtnHide.addEventListener("click", () => {
            if (note.userId == localStorage.getItem("userID")) {
                if (note.hide) {
                    datos = {
                        id: note.id,
                        title: note.title,
                        content: note.content,
                        userID: note.userId,
                        dateModified: note.dateModified,
                        hide: false,
                    }
    
                    notyf.success("La nota se mostró correctamente");
                    fetch(`${notesUrl}/${note.id}`, {
                        method: "PUT",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(datos)
                    }).then(r => r.json()).then((noteHide) => {
                        setTimeout(() => {
                            location.reload()
                        },2000)
                    });
                } else {
                    datos = {
                        id: note.id,
                        title: note.title,
                        content: note.content,
                        userID: note.userId,
                        dateModified: note.dateModified,
                        hide: true,
                    }
    
                    notyf.success("La nota se ocultó correctamente");
                    fetch(`${notesUrl}/${note.id}`, {
                        method: "PUT",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(datos)
                    }).then(r => r.json()).then((noteHide) => {
                        setTimeout(() => {
                            location.reload()
                        },2000)
                    });
                }
            } else {
                notyf.error("No puedes ocultar una nota que no creaste");
            }
        });

        dropdownMenuLiHide.appendChild(editordropdownMenuBtnHide);
        dropdownMenu.append(dropdownMenuLiDelete, dropdownMenuLiHide);

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

        // Notas ocultas
        if (note.userId != localStorage.getItem("userID") && !note.hide || note.userId == localStorage.getItem("userID")) {
            recentNotes.appendChild(noteDiv);
        }
    });

    const newNoteContainer = document.querySelector('.newNote-container');
    recentNotes.appendChild(newNoteContainer);
}).catch(e => {
    notyfServer.error('Hubo un error en el servidor')
});

// NewNote
const newNote = document.querySelector(".newNote");
newNote.addEventListener("click", () => {
    localStorage.removeItem("noteID");
    localStorage.removeItem("noteHide");
})

// changeUser
const changeUser = document.querySelector('#changeUser');

changeUser.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});