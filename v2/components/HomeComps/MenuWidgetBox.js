import { html } from "../../libs/preact.js";

export default function MenuWidgetBox({ widget, openFullScreen }) {
  const { title, hidden, Comp } = widget;

  function openComp() {
    openFullScreen(Comp);
  }

  return html`
    <div className="grid gap-4 hover:opacity-100 p-2">
      <div className="flex gap-2">
        <${FullScreenButton} openComp=${openComp} />
        <${PinButton} hidden=${hidden} />
      </div>
      <h3 className="text-4xl">${title}</h3>
    </div>
  `;
}

function FullScreenButton({ openComp }) {
  return html`
    <button className="btn btn-primary btn-square btn-sm" onClick=${openComp}>
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
  `;
}

function PinButton({ hidden }) {
  return html`
    <button
      className="btn btn-primary btn-square btn-sm ${hidden
        ? "opacity-50"
        : "opacity-100"}"
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
