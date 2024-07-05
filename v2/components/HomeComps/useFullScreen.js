import { html, useState } from "../../libs/preact.js";

export default function useFullScreen() {
  const [comp, setComp] = useState({
    Comp: null,
  });

  function openFullScreen(compToOpen) {
    setComp({
      Comp: compToOpen,
    });
  }

  return {
    FullScreen: function () {
      return html`<${FullScreen} comp=${comp} setComp=${setComp} />`;
    },
    openFullScreen,
  };
}

function FullScreen({ comp, setComp }) {
  function closeFullScreen() {
    setComp({
      Comp: null,
    });
  }

  const Comp = comp.Comp;

  if (!Comp) {
    return null;
  }

  return html`
    <div className="fixed inset-0 bg-base-100">
      <button
        className="btn btn-square btn-primary absolute top-2 right-2"
        onClick=${closeFullScreen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          enable-background="new 0 0 24 24"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          className="fill-current"
        >
          <rect fill="none" height="24" width="24" />
          <path
            d="M22,3.41l-5.29,5.29L20,12h-8V4l3.29,3.29L20.59,2L22,3.41z M3.41,22l5.29-5.29L12,20v-8H4l3.29,3.29L2,20.59L3.41,22z"
          />
        </svg>
      </button>
      <${Comp} />
    </div>
  `;
}
