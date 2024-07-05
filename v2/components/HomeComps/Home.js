import { html, useState } from "../../libs/preact.js";
import Calendar from "../Widgets/Calendar.js";
import AddSubject from "../Widgets/AddSubject.js";
import AddChapters from "../Widgets/AddChapters.js";
import Clock from "../Widgets/Clock.js";
import SubjectsPlan from "../Widgets/SubjectsPlan.js";
import NavBar from "./NavBar.js";
import MenuWidgetBox from "./MenuWidgetBox.js";
import useFullScreen from "./useFullScreen.js";

export default function Home() {
  const { FullScreen, openFullScreen } = useFullScreen();
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
      Comp: SubjectsPlan,
      title: "과목별 공부 계획",
      hidden: false,
      pinned: false,
    },
    {
      Comp: AddSubject,
      title: "과목 추가",
      hidden: true,
      pinned: false,
    },
    {
      Comp: AddChapters,
      title: "챕터 추가",
      hidden: true,
      pinned: false,
    },
  ];

  return html`
    <${NavBar} menuOpen=${menuOpen} setMenuOpen=${setMenuOpen} />
    <${Main}
      menuOpen=${menuOpen}
      widgets=${widgets}
      openFullScreen=${openFullScreen}
    />
    <${FullScreen} />
  `;
}

function Main({ menuOpen, widgets, openFullScreen }) {
  const activeWidgets = widgets.filter((widget) => !widget.hidden);

  if (menuOpen) {
    return html`
      <div className="grid grid-cols-4 gap-4">
        ${widgets.map(
          (widget) =>
            html`
              <${MenuWidgetBox}
                widget=${widget}
                openFullScreen=${openFullScreen}
              />
            `
        )}
      </div>
    `;
  }

  return html`
    <div className="flex flex-col flex-wrap max-h-screen">
      ${activeWidgets.map(
        ({ Comp, title }) => html`
          <div className="w-1/2 p-2" key=${title}>
            <${Comp} />
          </div>
        `
      )}
    </div>
  `;
}
