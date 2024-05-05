const usersUrl = "http://192.168.1.19:5202/api/users";
const notesUrl = "http://192.168.1.19:5202/api/notes";

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
                Name: userName,
            }
            
            fetch(usersUrl).then(r => r.json()).then((d) => {
                const userFind = d.find(user => user.name.toLowerCase() == userName.toLowerCase());
                
                if (!userFind) {
                    fetch(usersUrl, {
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify(datos)
                    }).then(r => r.json()).then((d) => {
                        const userFindNew = d.find(user => user.name.toLowerCase() == userName.toLowerCase());
                        localStorage.setItem("userID", userFindNew.id);
                        console.log(localStorage.getItem("userID"));
                    })
                } else {
                    localStorage.setItem("userID", userFind.id);
                    console.log(localStorage.getItem("userID"));
                }
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
    d.forEach((note) => {

        // Div Nota
        const noteDiv = document.createElement("div");
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
            const confirmDelete = confirm(`¿Estás seguro de eliminar la nota "${note.title}"?`)

            if (confirmDelete) {
                fetch(`${notesUrl}/${note.id}`, {
                    method: "DELETE"
                }).then(
                    alert(`Se eliminó correctamente la nota "${note.title}"`),
                    location.reload()
                );
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

// changeUser
const changeUser = document.querySelector('#changeUser');

changeUser.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});