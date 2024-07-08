import { html, useState } from "../../libs/preact.js";
import AddSubject from "../Widgets/AddSubject.js";
import AddChapters from "../Widgets/AddChapters.js";
import Clock from "../Widgets/Clock.js";
import NavBar from "./NavBar.js";
import MenuWidgetBox from "./MenuWidgetBox.js";
import useFullScreen from "./useFullScreen.js";
import StudyCalendar from "../Widgets/StudyCalendar.js";
import StudyPlans from "../Widgets/StudyPlans.js";
import RoutineCalendar from "../Widgets/RoutineCalendar.js";
import AddTask from "../Widgets/AddTask.js";
import RoutinesToDo from "../Widgets/RoutinesToDo.js";
import StudyCycle from "../Widgets/StudyCycle.js";

export default function Home() {
  const { FullScreen, openFullScreen } = useFullScreen();
  const [page, setPage] = useState("home");
  const widgets = [
    {
      Comp: RoutineCalendar,
      title: "일일 달력",
      hidden: false,
      pinned: false,
    },
    {
      Comp: AddTask,
      title: "할 일 추가",
      hidden: false,
      pinned: false,
    },
    {
      Comp: RoutinesToDo,
      title: "할 일 목록",
      hidden: false,
      pinned: false,
    },
    {
      Comp: StudyCalendar,
      title: "학습 달력",
      hidden: false,
      pinned: false,
    },
    {
      Comp: StudyCycle,
      title: "학습 주기",
      hidden: false,
      pinned: false,
    },
    {
      Comp: StudyPlans,
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
    {
      Comp: Clock,
      title: "시계",
      hidden: true,
      pinned: false,
    },
  ];

  return html`
    <${NavBar} page=${page} setPage=${setPage} />
    <${Main} page=${page} widgets=${widgets} openFullScreen=${openFullScreen} />
    <${FullScreen} />
  `;
}

function Main({ page, widgets, openFullScreen }) {
  const activeWidgets = widgets.filter((widget) => !widget.hidden);

  if (page === "menu") {
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
