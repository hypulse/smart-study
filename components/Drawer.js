import { html } from "../libs/preact.js";
import AddRoutine from "./AddRoutine.js";
import SignInContainer from "./SignInContainer.js";

export default function Drawer({ widgets, layoutManager }) {
  return html`
    <div className="drawer-side" style="z-index: 1000;">
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="bg-base-200 grid gap-2 p-4">
        <${SignInContainer} />
        <${AddRoutine} />
        <ul className="menu">
          ${widgets.map(
            ({ name, active }) =>
              html`
                <li
                  onClick=${() => layoutManager.toggleWidget(name)}
                  key=${name}
                >
                  <a>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked=${active}
                    />
                    <span>${name}</span>
                  </a>
                </li>
              `
          )}
        </ul>
      </div>
    </div>
  `;
}
