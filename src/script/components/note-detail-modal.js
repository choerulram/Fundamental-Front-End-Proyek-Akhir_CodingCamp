// custom element NoteDetailModal
class NoteDetailModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0, 0, 0, 0.4);
                }
                .modal-content {
                    background-color: #fefefe;
                    margin: 8% auto;
                    padding: 20px;
                    border: 1px solid #888;
                    border-radius: 20px;
                    width: 54%;
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
            </style>
            <div class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Note Details</h2>
                    <div id="noteDetails"></div>
                </div>
            </div>
        `;

    this.closeButton = this.shadowRoot.querySelector(".close");
    this.noteDetailsElement = this.shadowRoot.querySelector("#noteDetails");

    this.closeButton.onclick = () => this.hide();
  }

  show(note) {
    this.noteDetailsElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <small>Created at: ${new Date(note.createdAt).toLocaleString()}</small>
            <p>Archived: ${note.archived ? "Yes" : "No"}</p>
        `;
    this.shadowRoot.querySelector(".modal").style.display = "block";
  }

  hide() {
    this.shadowRoot.querySelector(".modal").style.display = "none";
  }
}

customElements.define("note-detail-modal", NoteDetailModal);
