import { html, useEffect, useState } from "../../libs/preact.js";
import AddSubject from "../Widgets/AddSubject.js";
import AddChapters from "../Widgets/AddChapters.js";
import NavBar from "./NavBar.js";
import useFullScreen from "./useFullScreen.js";
import StudyCalendar from "../Widgets/StudyCalendar.js";
import StudyPlans from "../Widgets/StudyPlans.js";
import RoutineCalendar from "../Widgets/RoutineCalendar.js";
import AddTask from "../Widgets/AddTask.js";
import RoutinesToDo from "../Widgets/RoutinesToDo.js";
import StudyCycle from "../Widgets/StudyCycle.js";
import Menu from "../Widgets/Menu.js";

export default function Home() {
  // TODO - Add Home Context
  const { FullScreen, openFullScreen } = useFullScreen();
  const [widgets, setWidgets] = useState([
    {
      Comp: RoutineCalendar,
      title: "일일 달력",
      hidden: true,
    },
    {
      Comp: AddTask,
      title: "할 일 추가",
      hidden: true,
    },
    {
      Comp: RoutinesToDo,
      title: "할 일 목록",
      hidden: true,
    },
    {
      Comp: StudyCalendar,
      title: "학습 달력",
      hidden: true,
    },
    {
      Comp: StudyCycle,
      title: "학습 주기",
      hidden: true,
    },
    {
      Comp: StudyPlans,
      title: "과목별 공부 계획",
      hidden: true,
    },
    {
      Comp: AddSubject,
      title: "과목 추가",
      hidden: true,
    },
    {
      Comp: AddChapters,
      title: "챕터 추가",
      hidden: true,
    },
    {
      Comp: Menu,
      title: "메뉴",
      hidden: true,
    },
  ]);
  const pages = [
    {
      title: "Routine",
      widgets: ["RoutineCalendar", "RoutinesToDo"],
    },
    {
      title: "Study",
      widgets: ["StudyCalendar", "StudyPlans"],
    },
    {
      title: "Others",
      widgets: ["AddTask", "StudyCycle"],
    },
    { title: "Menu", widgets: ["Menu"] },
  ];
  const activeWidgets = widgets.filter((widget) => !widget.hidden);

  const applyWidgets = (widgets) => {
    setWidgets((prev) => {
      prev.sort((a, b) => {
        const aIndex = widgets.indexOf(a.Comp.name);
        const bIndex = widgets.indexOf(b.Comp.name);
        return aIndex - bIndex;
      });
      return prev.map((widget) => {
        if (widgets.includes(widget.Comp.name)) {
          widget.hidden = false;
        } else {
          widget.hidden = true;
        }
        return widget;
      });
    });
  };

  useEffect(() => {
    applyWidgets(pages[0].widgets);
  }, []);

  return html`
    <${NavBar} pages=${pages} applyWidgets=${applyWidgets} />
    <div className="flex flex-col flex-wrap max-h-screen">
      ${activeWidgets.map(
        ({ Comp, title }) => html`
          <div className="w-1/2 p-2" key=${title}>
            <${Comp} />
          </div>
        `
      )}
    </div>
    <${FullScreen} />
  `;
}
