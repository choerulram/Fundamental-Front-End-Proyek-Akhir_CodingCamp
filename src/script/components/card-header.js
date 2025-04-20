// custom element CardHeader
class CardHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
            <style>
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid rgb(183, 214, 181);
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .status-cell {
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .status-cell:hover {
                    background-color: rgba(0, 123, 255, 0.1);
                }
                .status-cell h3 {
                    margin-bottom: 5px;
                }
                .status-cell p {
                    font-size: 18px;
                    font-weight: bold;
                }
            </style>
            <div class="card-header">
                <div class="status-cell" id="unarchivedCell">
                    <h3>Unarchived</h3>
                    <p id="unarchivedCount">0</p>
                </div>
                <div class="status-cell" id="archivedCell">
                    <h3>Archived</h3>
                    <p id="archivedCount">0</p>
                </div>
            </div>
        `;

    // Menambahkan event listener
    this.shadowRoot
      .getElementById("unarchivedCell")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("show-unarchived", { bubbles: true }),
        );
      });

    this.shadowRoot
      .getElementById("archivedCell")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("show-archived", { bubbles: true }));
      });
  }
}

customElements.define("card-header", CardHeader);
