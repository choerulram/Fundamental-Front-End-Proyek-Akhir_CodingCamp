// custom element NoteCard
class NoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <div class="note-card">
                <h2></h2>
                <p></p>
                <small></small>
                <p></p>
                <div class="button-container">
                    <button class="delete-button">Delete Note</button>
                    <button class="archive-button">Archive Note</button>
                    <button class="unarchive-button">Unarchive Note</button>
                    <button class="detail-button">View Details</button>
                </div>
            </div>
        `;

    // get elemen from shadow DOM
    this.titleElement = this.shadowRoot.querySelector("h2");
    this.bodyElement = this.shadowRoot.querySelector("p:nth-of-type(1)");
    this.createdAtElement = this.shadowRoot.querySelector("small");
    this.archivedElement = this.shadowRoot.querySelector("p:nth-of-type(2)");
    this.deleteButton = this.shadowRoot.querySelector(".delete-button");
    this.archiveButton = this.shadowRoot.querySelector(".archive-button");
    this.unarchiveButton = this.shadowRoot.querySelector(".unarchive-button");
    this.detailButton = this.shadowRoot.querySelector(".detail-button");
  }

  // setter untuk mengisi data note ke dalam elemen
  set noteData(data) {
    this.titleElement.textContent = data.title;
    this.bodyElement.textContent = data.body;
    this.createdAtElement.textContent = `Created at: ${new Date(data.createdAt).toLocaleString()}`;
    this.archivedElement.textContent = `Archived: ${data.archived ? "Yes" : "No"}`;

    // add event listener tombol delete
    this.deleteButton.onclick = () =>
      this.dispatchEvent(new CustomEvent("delete-note", { detail: data.id }));

    // add event listener for detail button
    this.detailButton.onclick = () =>
      this.dispatchEvent(new CustomEvent("view-detail", { detail: data.id }));

    // set custom attribute untuk note ID
    this.setAttribute("data-note-id", data.id);
  }
}

customElements.define("note-card", NoteCard);
