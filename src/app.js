// import note data
import './styles/style.css';
import './script/components/header.js';
import './script/components/footer.js';
import './script/components/note-card.js';
import './script/components/note-modal.js';
import { notesData } from './script/data/local/notes-data.js';
// import { loadNotes, saveNotes } from './script/data/local/notes-data.js';

// load notes from localStorage
function loadNotes() {
    const storedNotes = localStorage.getItem("notes");
    return storedNotes ? JSON.parse(storedNotes) : notesData;
}

// save notes to localStorage
function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// get elements
const modal = document.querySelector('note-modal');
const addNoteButton = document.getElementById("addNoteButton");
const notesListElement = document.querySelector("#notesList");
const searchForm = document.getElementById('searchNote');
const searchInput = document.getElementById('searchNoteTitle');

// render notes
function renderNotes(notes) {
    notesListElement.innerHTML = "";
    notes.forEach((note) => {
        const element = createNoteItemElement(note);
        notesListElement.append(element);
    });
}

// create note item element
function createNoteItemElement({ id, title, body, createdAt, archived }) {
    // create container for note
    const container = document.createElement("div");
    container.setAttribute("data-noteid", id);
    container.classList.add("note-card");

    // create title element
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;

    // create body element
    const bodyElement = document.createElement("p");
    bodyElement.innerText = body;

    // create datetime element now
    const createdAtElement = document.createElement("small");
    createdAtElement.textContent = `Created at: ${new Date(createdAt).toLocaleString()}`;

    // create archived
    const archivedElement = document.createElement("p");
    archivedElement.textContent = `Archived: ${archived ? "Yes" : "No"}`;

    // create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Note";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            modal.shadowRoot.querySelector('input[name="title"]').value = noteToEdit.title;
            modal.shadowRoot.querySelector('textarea[name="body"]').value = noteToEdit.body;
            modal.show();

            // Simpan ID catatan yang sedang diedit
            modal.setAttribute('data-edit-id', id);
        }
    });

    // create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Note";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus catatan ini?");
        if (confirmDelete) {
            notes.splice(notes.findIndex((note) => note.id === id), 1);
            saveNotes(notes);
            renderNotes(notes);
        }
    });

    // create a container for buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.append(editButton, deleteButton);

    container.append(
        titleElement,
        bodyElement,
        createdAtElement,
        archivedElement,
        buttonContainer
    );

    return container;
}

// initial render
const notes = loadNotes();
renderNotes(notes);

// clear the form fields if add note button click
addNoteButton.addEventListener("click", () => {
    modal.shadowRoot.querySelector('input[name="title"]').value = '';
    modal.shadowRoot.querySelector('textarea[name="body"]').value = '';
    modal.shadowRoot.querySelector("#titleFeedback").textContent = '';
    modal.shadowRoot.querySelector("#bodyFeedback").textContent = '';
    modal.show();
});

// handle note from modal
modal.addEventListener('save-note', (event) => {
    if (modal.getAttribute('data-valid') === 'true') {
        const { title, body } = event.detail;
        const editId = modal.getAttribute('data-edit-id');

        if (editId) {
            // update existing note
            const noteToUpdate = notes.find(note => note.id === editId);
            if (noteToUpdate) {
                noteToUpdate.title = title;
                noteToUpdate.body = body;
            }
        } else {
            // create new note
            const newNote = {
                id: `notes-${Date.now()}`,
                title,
                body,
                createdAt: new Date().toISOString(),
                archived: false,
            };
            notes.push(newNote);
        }

        saveNotes(notes);
        renderNotes(notes);
        modal.removeAttribute('data-edit-id');
    }
});

// search functionality
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
});

// clear search when empty
searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
        renderNotes(notes); 
    }
});