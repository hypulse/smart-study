import { html } from "../../libs/preact.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";

export default function NavBar({ page, setPage }) {
  const pages = [
    {
      title: "Home",
      page: "home",
    },
    {
      title: "Menu",
      page: "menu",
    },
    {
      title: "Study",
      page: "menu",
    },
    {
      title: "Routine",
      page: "menu",
    },
    {
      title: "Others",
      page: "menu",
    },
  ];

  return html`
    <div className="flex gap-4 items-center">
      ${pages.map(
        (p) => html`
          <a
            className="text-4xl link link-hover"
            onClick=${() => setPage(p.page)}
          >
            ${p.title}
          </a>
        `
      )}
      <button
        className="btn btn-primary btn-square"
        onClick=${requestUpdateRawData}
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
  `;
}
