// import note data
import "./styles/style.css";
import "./script/components/app-header.js";
import "./script/components/app-footer.js";
import "./script/components/note-card.js";
import "./script/components/note-modal.js";
import "./script/components/card-header.js";
import "./script/components/note-detail-modal.js";
import "./script/components/loading-indicator.js";
import Swal from "sweetalert2";
import { gsap } from "gsap";

// base URL
const baseUrl = "https://notes-api.dicoding.dev/v2";

// get elements
const modal = document.querySelector("note-modal");
const loadingIndicator = document.createElement("loading-indicator");
document.body.appendChild(loadingIndicator);
const addNoteButton = document.getElementById("addNoteButton");
const notesListElement = document.querySelector("#notesList");
const searchForm = document.getElementById("searchNote");
const searchInput = document.getElementById("searchNoteTitle");
const cardHeader = document.querySelector("card-header");

// tangani event dari card-header
cardHeader.addEventListener("show-unarchived", () => {
  getNotes().then(renderNotes);
});

cardHeader.addEventListener("show-archived", () => {
  getArchivedNotes().then(renderNotes);
});

// get note from API
const getNotes = () => {
  loadingIndicator.show();
  return fetch(`${baseUrl}/notes`)
    .then((response) => response.json())
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return [];
      } else {
        return responseJson.data;
      }
    })
    .catch((error) => {
      loadingIndicator.hide();
      showResponseMessage(error);
      return [];
    });
};

// get archived note API
const getArchivedNotes = () => {
  loadingIndicator.show();
  return fetch(`${baseUrl}/notes/archived`)
    .then((response) => response.json())
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return [];
      } else {
        return responseJson.data;
      }
    })
    .catch((error) => {
      loadingIndicator.hide();
      showResponseMessage(error);
      return [];
    });
};

// save note API
const insertNotes = (note) => {
  loadingIndicator.hide();
  return fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
    .then((response) => {
      loadingIndicator.hide();
      return response.json();
    })
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return null;
      } else {
        return responseJson.data;
      }
    })
    .catch((error) => {
      showResponseMessage(error);
      return null;
    });
};

// delete note from API
const removeNotes = (noteId) => {
  loadingIndicator.hide();
  return fetch(`${baseUrl}/notes/${noteId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return false;
      } else {
        return true;
      }
    })
    .catch((error) => {
      loadingIndicator.hide();
      showResponseMessage(error);
      return false;
    });
};

// archivde note from API
const archiveNote = (noteId) => {
  loadingIndicator.hide();
  return fetch(`${baseUrl}/notes/${noteId}/archive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return false;
      } else {
        return true;
      }
    })
    .catch((error) => {
      loadingIndicator.hide();
      showResponseMessage(error);
      return false;
    });
};

// unarchivde note from API
const unarchiveNote = (noteId) => {
  loadingIndicator.hide();
  return fetch(`${baseUrl}/notes/${noteId}/unarchive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return false;
      } else {
        return true;
      }
    })
    .catch((error) => {
      loadingIndicator.hide();
      showResponseMessage(error);
      return false;
    });
};

// get detail notes from API
const getSingleNoteDetail = (noteId) => {
  loadingIndicator.hide();
  return fetch(`${baseUrl}/notes/${noteId}`)
    .then((response) => response.json())
    .then((responseJson) => {
      loadingIndicator.hide();
      if (responseJson.error) {
        showResponseMessage(responseJson.message);
        return null;
      } else {
        return responseJson.data;
      }
    })
    .catch((error) => {
      loadingIndicator.hide();
      showResponseMessage(error);
      return null;
    });
};

// get detail note
const showNoteDetail = (noteId) => {
  getSingleNoteDetail(noteId).then((note) => {
    if (note) {
      const detailModal = document.querySelector("note-detail-modal");
      detailModal.show(note);
    }
  });
};

// show message respons
const showResponseMessage = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
};

// render notes
function renderNotes(notes) {
  notesListElement.innerHTML = "";
  notes.forEach((note) => {
    const element = createNoteItemElement(note);
    notesListElement.append(element);

    // add animate fade-in
    gsap.from(element, { duration: 0.5, opacity: 0, y: -20 });
  });
}

// create note item element
function createNoteItemElement({ id, title, body, createdAt, archived }) {
  const container = document.createElement("div");
  container.setAttribute("data-noteid", id);
  container.classList.add("note-card");

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const bodyElement = document.createElement("p");
  bodyElement.innerText = body;

  const createdAtElement = document.createElement("small");
  createdAtElement.textContent = `Created at: ${new Date(createdAt).toLocaleString()}`;

  const archivedElement = document.createElement("p");
  archivedElement.textContent = `Archived: ${archived ? "Yes" : "No"}`;

  // delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Note";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus catatan ini?",
    );
    if (confirmDelete) {
      // add animasi sebelum menghapus
      gsap.to(container, {
        duration: 0.5,
        opacity: 0,
        y: -20,
        onComplete: () => {
          removeNotes(id).then((success) => {
            if (success) {
              getNotes().then((notesData) => {
                renderNotes(notesData);
                updateStatusCounts();
              });
            }
          });
        },
      });
    }
  });

  // Archive/Unarchive button
  const archiveButton = document.createElement("button");
  archiveButton.textContent = archived ? "Unarchive Note" : "Archive Note";
  archiveButton.classList.add(archived ? "unarchive-button" : "archive-button");
  archiveButton.addEventListener("click", () => {
    const action = archived ? "unarchive" : "archive";
    const confirmAction = confirm(
      `Apakah Anda yakin ingin ${action} catatan ini?`,
    );
    if (confirmAction) {
      const actionFunction = archived ? unarchiveNote : archiveNote;
      actionFunction(id).then((success) => {
        if (success) {
          getNotes().then((notesData) => {
            renderNotes(notesData);
            updateStatusCounts();
          });
        }
      });
    }
  });

  // detail button
  const detailButton = document.createElement("button");
  detailButton.textContent = "View Details";
  detailButton.classList.add("detail-button");
  detailButton.addEventListener("click", () => {
    showNoteDetail(id);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  buttonContainer.append(deleteButton, archiveButton, detailButton);

  container.append(
    titleElement,
    bodyElement,
    createdAtElement,
    archivedElement,
    buttonContainer,
  );

  return container;
}

// update status counts
const updateStatusCounts = () => {
  Promise.all([getNotes(), getArchivedNotes()]).then(
    ([notesData, archivedNotesData]) => {
      const archivedCount = archivedNotesData.length;
      const unarchivedCount = notesData.filter((note) => !note.archived).length;

      const cardHeader = document.querySelector("card-header");
      if (cardHeader) {
        const archivedCountElement =
          cardHeader.shadowRoot.getElementById("archivedCount");
        const unarchivedCountElement =
          cardHeader.shadowRoot.getElementById("unarchivedCount");

        if (archivedCountElement && unarchivedCountElement) {
          archivedCountElement.textContent = archivedCount;
          unarchivedCountElement.textContent = unarchivedCount;
        } else {
          console.error(
            "Count elements not found in the card-header shadow DOM.",
          );
        }
      } else {
        console.error("Card header component not found in the DOM.");
      }
    },
  );
};

// initial render
getNotes().then((notesData) => {
  renderNotes(notesData);
  updateStatusCounts();
});

// clear the form fields if add note button click
addNoteButton.addEventListener("click", () => {
  modal.shadowRoot.querySelector('input[name="title"]').value = "";
  modal.shadowRoot.querySelector('textarea[name="body"]').value = "";
  modal.shadowRoot.querySelector("#titleFeedback").textContent = "";
  modal.shadowRoot.querySelector("#bodyFeedback").textContent = "";
  modal.show();
});

// handle note from modal
modal.addEventListener("save-note", (event) => {
  if (modal.getAttribute("data-valid") === "true") {
    const { title, body } = event.detail;
    const newNote = {
      title,
      body,
    };
    insertNotes(newNote).then((savedNote) => {
      if (savedNote) {
        getNotes().then((notesData) => {
          renderNotes(notesData);
          updateStatusCounts();
        });
      }
    });
  }
});