import { html } from "../libs/preact.js";

export default function Popup() {
  return html`
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg" id="modal-title"></h3>
        <p className="py-4" id="modal-content"></p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  `;
}
