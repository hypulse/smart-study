import { html, useState } from "../libs/preact.js";
import Calendar from "./Widgets/Calendar.js";
import Clock from "./Widgets/Clock.js";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const widgets = [
    {
      Comp: Clock,
      title: "Clock",
      hidden: false,
      pinned: false,
    },
    {
      Comp: Calendar,
      title: "Calendar",
      hidden: false,
      pinned: false,
    },
  ];

  const activeWidgets = widgets.filter((widget) => !widget.hidden);

  if (menuOpen) {
    return html`
      <div className="grid gap-8">
        <a
          className="text-6xl link link-hover"
          onClick=${() => setMenuOpen(false)}
        >
          Menu
        </a>
        <div className="grid grid-cols-4 gap-4">
          ${widgets.map(
            (widget) => html`<${WidgetMenuBox} widget=${widget} />`
          )}
        </div>
      </div>
    `;
  }

  return html`
    <div className="grid gap-8">
      <a
        className="text-6xl link link-hover"
        onClick=${() => setMenuOpen(true)}
      >
        Home
      </a>
      <div className="flex flex-col flex-wrap gap-4">
        ${activeWidgets.map(
          ({ Comp, title }) => html`
            <div className="w-1/2" key=${title}>
              <${Comp} />
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function WidgetMenuBox({ widget }) {
  const { title, hidden, pinned } = widget;

  return html`
    <div
      className="grid gap-4 hover:opacity-100 p-2 ${hidden
        ? "opacity-50"
        : "opacity-100"}"
    >
      <div className="flex justify-between items-center">
        <button className="btn btn-primary btn-square btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <rect fill="none" height="24" width="24" />
            <polygon
              points="21,11 21,3 13,3 16.29,6.29 6.29,16.29 3,13 3,21 11,21 7.71,17.71 17.71,7.71"
            />
          </svg>
        </button>
        ${!hidden && html`<${PinButton} pinned=${pinned} />`}
        ${hidden ? html`<${AddButton} />` : html`<${RemoveButton} />`}
      </div>
      <h3 className="text-4xl">${title}</h3>
    </div>
  `;
}

function PinButton({ pinned }) {
  function togglePin() {}

  return html`
    <button
      className="btn btn-primary btn-square btn-sm ${pinned
        ? "opacity-100"
        : "opacity-50"}"
      onClick=${togglePin}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 24 24"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <g><rect fill="none" height="24" width="24" /></g>
        <g>
          <path
            d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z"
            fill-rule="evenodd"
          />
        </g>
      </svg>
    </button>
  `;
}

function RemoveButton() {
  return html`
    <button className="btn btn-primary btn-square btn-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </svg>
    </button>
  `;
}

function AddButton() {
  return html`
    <button className="btn btn-primary btn-square btn-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
      </svg>
    </button>
  `;
}
