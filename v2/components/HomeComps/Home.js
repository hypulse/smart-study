import { html, useState } from "../../libs/preact.js";
import WidgetMenuBox from "./WIdgetMenuBox.js";
import Calendar from "../WidgetComps/Calendar.js";
import AddSubject from "../WidgetComps/AddSubject.js";
import AddChapters from "../WidgetComps/AddChapters.js";
import Clock from "../WidgetComps/Clock.js";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const widgets = [
    {
      Comp: Clock,
      title: "시계",
      hidden: false,
      pinned: false,
    },
    {
      Comp: Calendar,
      title: "달력",
      hidden: false,
      pinned: false,
    },
    {
      Comp: AddSubject,
      title: "과목 추가",
      hidden: false,
      pinned: false,
    },
    {
      Comp: AddChapters,
      title: "챕터 추가",
      hidden: false,
      pinned: false,
    },
  ];

  const activeWidgets = widgets.filter((widget) => !widget.hidden);

  if (menuOpen) {
    return html`
      <div className="grid gap-4">
        <${NavBar} menuOpen=${menuOpen} setMenuOpen=${setMenuOpen} />
        <div className="grid grid-cols-4 gap-4">
          ${widgets.map(
            (widget) => html`<${WidgetMenuBox} widget=${widget} />`
          )}
        </div>
      </div>
    `;
  }

  return html`
    <div className="grid gap-4">
      <${NavBar} menuOpen=${menuOpen} setMenuOpen=${setMenuOpen} />
      <div className="flex flex-col flex-wrap max-h-screen">
        ${activeWidgets.map(
          ({ Comp, title }) => html`
            <div className="w-1/2 p-2" key=${title}>
              <${Comp} />
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function NavBar({ menuOpen, setMenuOpen }) {
  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  return html`
    <div>
      <a className="text-4xl link link-hover" onClick=${toggleMenu}>
        ${menuOpen ? "Menu" : "Home"}
      </a>
    </div>
  `;
}