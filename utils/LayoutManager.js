import Planner from "../components/Planner/Planner.js";
import StudyReview from "../components/StudyReview/StudyReview.js";
import TaskStack from "../components/TaskStack/TaskStack.js";
import Calendar from "../components/widgets/Calendar.js";
import TaskShortcut from "../components/widgets/TaskShrotcut.js";
import WeatherWidget from "../components/widgets/WeatherWidget.js";
import BulletinBoard from "../components/widgets/BulletinBoard.js";
import Radio from "../components/widgets/Radio.js";

class LayoutManager {
  static defaultWidgets = [
    {
      name: "할 일",
      component: TaskStack,
      active: false,
    },
    {
      name: "할 일 추가",
      component: TaskShortcut,
      active: false,
    },
    {
      name: "학습 관리",
      component: StudyReview,
      active: false,
    },
    {
      name: "게시판",
      component: BulletinBoard,
      active: false,
    },
    {
      name: "계획표",
      component: Planner,
      active: false,
    },
    {
      name: "달력",
      component: Calendar,
      active: false,
    },
    {
      name: "라디오",
      component: Radio,
      active: false,
    },
    {
      name: "날씨",
      component: WeatherWidget,
      active: false,
    },
  ];

  static defaultLayout = localStorage.getItem("layout")
    ? JSON.parse(localStorage.getItem("layout"))
    : [
        "할 일",
        "할 일 추가",
        "달력",
        "학습 관리",
        "계획표",
        "게시판",
        "라디오",
        "날씨",
      ];

  static getWidgetsLayout(widgets, layout) {
    widgets.sort((a, b) => {
      return layout.indexOf(a.name) - layout.indexOf(b.name);
    });
    const newWidgets = widgets.map((widget) => {
      return {
        ...widget,
        active: layout.includes(widget.name),
      };
    });
    const sortedWidgets = LayoutManager.sortWidgets(newWidgets);
    return sortedWidgets;
  }

  static sortWidgets(widgets) {
    return widgets.sort((a, b) => {
      return a.active === b.active ? 0 : a.active ? -1 : 1;
    });
  }

  constructor(widgets, setWidgets) {
    this.widgets = widgets;
    this.setWidgets = setWidgets;
  }

  setWidgetsLayout = (layout) => {
    const newWidgets = LayoutManager.getWidgetsLayout(this.widgets, layout);
    this.setWidgets(newWidgets);
  };

  toggleWidget = (widgetName) => {
    const newWidgets = this.widgets.map((widget) => {
      if (widget.name === widgetName) {
        return {
          ...widget,
          active: !widget.active,
        };
      }
      return widget;
    });
    const sortedWidgets = LayoutManager.sortWidgets(newWidgets);
    localStorage.setItem(
      "layout",
      JSON.stringify(
        sortedWidgets
          .filter((widget) => widget.active)
          .map((widget) => widget.name)
      )
    );
    this.setWidgets(sortedWidgets);
  };
}

export default LayoutManager;
