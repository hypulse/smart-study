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
import { HomeContextProvider } from "../../hooks/useHomeContext.js";
import requestUpdateRawData from "../../utils/requestUpdateRawData.js";
import Screensaver from "../Widgets/Screensaver.js";
import useSpeakOClock from "../../hooks/useSpeakOClock.js";
import EventCalendar from "../Widgets/EventCalendar.js";
import Note from "../Widgets/Note.js";

export default function Home() {
  const { FullScreen, openFullScreen } = useFullScreen();
  useSpeakOClock();
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
    {
      Comp: Screensaver,
      title: "화면 보호기",
      hidden: true,
    },
    {
      Comp: EventCalendar,
      title: "이벤트 달력",
      hidden: true,
    },
    {
      Comp: Note,
      title: "노트",
      hidden: true,
    },
  ]);
  const pages = [
    {
      title: "Routine",
      widgets: ["RoutineCalendar", "StudyCycle", "AddTask", "RoutinesToDo"],
    },
    {
      title: "Study",
      widgets: ["StudyCalendar", "StudyPlans"],
    },
    {
      title: "Menu",
      widgets: ["EventCalendar", "Note", "Menu"],
    },
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

  // 초기 레이아웃 설정
  useEffect(() => {
    const currentPage = localStorage.getItem("currentPage") || 0;
    applyWidgets(pages[Number(currentPage)].widgets);
  }, []);

  // 자동 데이터 갱신 설정
  useEffect(() => {
    const interval = setInterval(() => {
      const realdate = localStorage.getItem("realdate");
      if (!realdate) {
        localStorage.setItem("realdate", dayjs().format("YYYY-MM-DD"));
      } else if (realdate !== dayjs().format("YYYY-MM-DD")) {
        localStorage.setItem("realdate", dayjs().format("YYYY-MM-DD"));
        const params = new URLSearchParams(window.location.search);
        params.set("routine_date", `${dayjs().format("YYYY-MM-DD")}`);
        window.location.search = params.toString();
        return;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // utterance 서비스 등록
  useEffect(() => {
    const interval = setInterval(() => {
      function utteranceSpeak(text) {
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "ko-KR";

          utterance.onend = () => resolve();
          utterance.onerror = () => reject();

          speechSynthesis.speak(utterance);
        });
      }

      function speakRecursion() {
        if (window.speakList && window.speakList.length > 0) {
          utteranceSpeak(window.speakList.shift()).then(speakRecursion);
        }
      }

      speakRecursion();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return html`
    <${HomeContextProvider}
      value=${{ widgets, pages, applyWidgets, openFullScreen }}
      children=${html`
        <${NavBar} />
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
      `}
    />
  `;
}
