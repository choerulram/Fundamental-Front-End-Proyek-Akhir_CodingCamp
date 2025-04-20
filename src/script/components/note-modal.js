// custom element NoteModal
class NoteModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        try {
            this.shadowRoot.innerHTML = `
                <style>
                /* h2 style */
                h2 {
                    width: 100%;
                    margin: 20px 0 30px 0;
                    text-align: center;
                    font-size: 28px;
                    color: rgba(0, 0, 0, 0.9);
                }

                /* start modal styles */
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

                .input > label {
                    font-weight: bold;
                    display: block;
                    width: 93%;
                    margin: 8px auto;
                }

                .input > input {
                    display: block;
                    width: 90%;
                    height: 50px;
                    margin: 10px auto;
                    border: none;
                    outline: none;
                    border: 1px solid rgb(134, 134, 134);
                    border-radius: 15px;
                    padding: 0 20px;
                    font-size: 16px;
                    font-family: "Poppins", sans-serif;
                }

                .input > textarea {
                    display: block;
                    width: 90%;
                    height: 150px;
                    margin: 10px auto;
                    border: none;
                    outline: none;
                    border: 1px solid rgb(134, 134, 134);
                    border-radius: 15px;
                    padding: 10px 20px;
                    font-size: 16px;
                    font-family: "Poppins", sans-serif;
                }

                .submit_note {
                    outline: none;
                    cursor: pointer;
                    /* width: 95%; */
                    margin: 15px 0 0 25px;
                    margin-bottom: 30px;
                    background-color: #0d6efd;
                    padding: 0px 20px;
                    border: 1px solid rgb(197, 194, 194);
                    border-radius: 10px;
                    color: white;
                    font-size: 16px;
                    height: 40px;
                }

                .submit_note:hover {
                    background-color: #0b61e1;
                    color: white;
                }

                .feedback {
                    color: red;
                    margin: 5px 0 15px 30px;
                    font-size: 14px;
                    padding: 5px;
                    border: 1px solid red;
                    border-radius: 5px;
                    background-color: rgba(255, 0, 0, 0.1);
                    animation: shake 0.3s;
                    display: none;
                    width: 100%;
                    max-width: 300px;
                }

                @keyframes shake {
                    0% { transform: translate(0); }
                    25% { transform: translate(-2px, 0); }
                    50% { transform: translate(2px, 0); }
                    75% { transform: translate(-2px, 0); }
                    100% { transform: translate(0); }
                }
                /* end modal style */
                </style>

                <div class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>Add Note</h2>
                        <form id="noteForm">
                            <div class="input">
                                <label>Judul</label>
                                <input type="text" name="title" required placeholder="Tuliskan judul catatan ..." />
                                <span id="titleFeedback" class="feedback"></span>
                            </div>
                            <div class="input">
                                <label>Body</label>
                                <textarea name="body" placeholder="Tuliskan isi catatan ..." required></textarea>
                                <span id="bodyFeedback" class="feedback"></span>
                            </div>
                            <button class="submit_note" type="submit">Save Note</button>
                        </form>
                    </div>
                </div>
            `;
    
            // get elemen from shadow DOM
            this.closeButton = this.shadowRoot.querySelector(".close");
            this.form = this.shadowRoot.querySelector("#noteForm");
            this.titleInput = this.shadowRoot.querySelector('input[name="title"]');
            this.bodyInput = this.shadowRoot.querySelector('textarea[name="body"]');
            this.titleFeedback = this.shadowRoot.querySelector("#titleFeedback");
            this.bodyFeedback = this.shadowRoot.querySelector("#bodyFeedback");
    
            // event listener close button
            this.closeButton.onclick = () => this.hide();
    
            // add event listener validasi real-time
            this.titleInput.addEventListener("input", () => this.validateTitle());
            this.bodyInput.addEventListener("input", () => this.validateBody());
    
            // atur pengiriman form
            this.form.onsubmit = (event) => {
                event.preventDefault();
                const title = this.titleInput.value;
                const body = this.bodyInput.value;
    
                // validasi pengiriman
                const titleLength = title.length;
                const bodyLength = body.length;
    
                if (titleLength < 5 || titleLength > 50 || bodyLength < 10 || bodyLength > 200) {
                    this.validateTitle();
                    this.validateBody();
                    this.setAttribute('data-valid', 'false');
                    return;
                }
    
                this.setAttribute("data-valid", "true");
                this.dispatchEvent(new CustomEvent("save-note", { detail: { title, body } }));
                this.hide();
            };
        } catch (error) {
            console.error("Error loading template:", error);
        }
    }

    validateTitle() {
        const titleLength = this.titleInput.value.length;
        if (titleLength < 5) {
            this.titleFeedback.innerHTML = "&#9888; Judul harus minimal 5 karakter.";
            this.titleFeedback.style.display = "block";
        } else if (titleLength > 50) {
            this.titleFeedback.innerHTML = "&#9888; Judul tidak boleh lebih dari 50 karakter.";
            this.titleFeedback.style.display = "block";
        } else {
            this.titleFeedback.textContent = "";
            this.titleFeedback.style.display = "none";
        }
    }

    validateBody() {
        const bodyLength = this.bodyInput.value.length;
        if (bodyLength < 10) {
            this.bodyFeedback.innerHTML = "&#9888; Body harus minimal 10 karakter.";
            this.bodyFeedback.style.display = "block";
        } else if (bodyLength > 200) {
            this.bodyFeedback.innerHTML = "&#9888; Body tidak boleh lebih dari 200 karakter.";
            this.bodyFeedback.style.display = "block";
        } else {
            this.bodyFeedback.textContent = "";
            this.bodyFeedback.style.display = "none";
        }
    }

    show() {
        this.style.display = "block"; 
        const modal = this.shadowRoot.querySelector(".modal");
        if (modal) {
            modal.style.display = "block";
        }
    }

    hide() {
        this.style.display = "none";
        const modal = this.shadowRoot.querySelector(".modal");
        if (modal) {
            modal.style.display = "none";
        }
    }
}

customElements.define("note-modal", NoteModal);