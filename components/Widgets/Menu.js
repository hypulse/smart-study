import { useHomeContext } from "../../hooks/useHomeContext.js";
import { html } from "../../libs/preact.js";

export default function Menu() {
  const { widgets } = useHomeContext();

  return html`
    <div className="grid grid-cols-4 gap-2">
      ${widgets.map((widget) => html`<${MenuWidgetBox} widget=${widget} />`)}
    </div>
  `;
}

function MenuWidgetBox({ widget }) {
  const { openFullScreen } = useHomeContext();
  const { title, hidden, Comp } = widget;

  function openComp() {
    openFullScreen(Comp);
  }

  return html`
    <div className="flex">
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
      <h3 className="text-2xl">${title}</h3>
    </div>
  `;
}
