// custom element NoteCard
class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="note-card">
                <h2></h2>
                <p></p>
                <small></small>
                <p></p>
                <div class="button-container">
                    <button class="edit-button">Edit Note</button>
                    <button class="delete-button">Delete Note</button>
                </div>
            </div>
        `;

        // get elemen from shadow DOM
        this.titleElement = this.shadowRoot.querySelector('h2');
        this.bodyElement = this.shadowRoot.querySelector('p:nth-of-type(1)');
        this.createdAtElement = this.shadowRoot.querySelector('small');
        this.archivedElement = this.shadowRoot.querySelector('p:nth-of-type(2)');
        this.editButton = this.shadowRoot.querySelector('.edit-button');
        this.deleteButton = this.shadowRoot.querySelector('.delete-button');
    }

    // setter untuk mengisi data note ke dalam elemen
    set noteData(data) {
        this.titleElement.textContent = data.title;
        this.bodyElement.textContent = data.body;
        this.createdAtElement.textContent = `Created at: ${new Date(data.createdAt).toLocaleString()}`;
        this.archivedElement.textContent = `Archived: ${data.archived ? "Yes" : "No"}`;

        // add event listener tombol edit dan delete
        this.editButton.onclick = () => this.dispatchEvent(new CustomEvent('edit-note', { detail: data }));
        this.deleteButton.onclick = () => this.dispatchEvent(new CustomEvent('delete-note', { detail: data.id }));

        // set custom attribute untuk note ID
        this.setAttribute('data-note-id', data.id);
    }
}

customElements.define('note-card', NoteCard);