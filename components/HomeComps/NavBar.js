import { useHomeContext } from "../../hooks/useHomeContext.js";
import { html } from "../../libs/preact.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";
import Clock from "./Clock.js";

export default function NavBar() {
  const { pages, applyWidgets } = useHomeContext();

  return html`
    <div className="flex gap-4 items-center fixed h-8">
      ${pages.map(
        (page, index) => html`
          <a
            className="text-2xl link link-hover"
            onClick=${() => {
              localStorage.setItem("currentPage", index);
              applyWidgets(page.widgets);
            }}
          >
            ${page.title}
          </a>
        `
      )}
      <div className="flex gap-2">
        <button
          className="btn btn-primary btn-square btn-sm"
          onClick=${() => {
            requestUpdateRawData();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className="fill-current"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
            />
          </svg>
        </button>
        <button
          className="btn btn-primary btn-square btn-sm"
          onClick=${() => {
            window.location.reload();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className="fill-current"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
          </svg>
        </button>
      </div>
      <${Clock} />
    </div>
    <div className="h-8" />
  `;
}
