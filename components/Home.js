import { html } from "../libs/preact.js";

export default function Home({ activeWidgets }) {
  return html`
    <div className="drawer-content">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 items-stretch">
        ${activeWidgets.map(
          ({ component: Widget, name }) =>
            html`
              <div className="grid gap-2 self-start" key=${name}>
                <h2 className="text-2xl">${name}</h2>
                <${Widget} />
              </div>
            `
        )}
      </div>
      <label
        htmlFor="my-drawer-4"
        className="drawer-button btn btn-circle"
        style="position: fixed; bottom: 0; right: 0; z-index: 1000;"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M2 20v-4h4v4zm6 0v-4h14v4zm-6-6v-4h4v4zm6 0v-4h14v4zM2 8V4h4v4zm6 0V4h14v4z"
          />
        </svg>
      </label>
    </div>
  `;
}
