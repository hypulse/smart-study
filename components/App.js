import { CONFIG_RECORD_ID } from "../env.js";
import { AppContextProvider } from "../hooks/useAppContext.js";
import useDateChangeEffect from "../hooks/useDateChangeEffect.js";
import useMinuteChangeEffect from "../hooks/useMinuteChangeEffect.js";
import usePbData from "../hooks/usePbData.js";
import { html, useEffect, useState } from "../libs/preact.js";
import CalendarManager from "../utils/CalendarManager.js";
import RoutineManager from "../utils/RoutineManager.js";
import { isBetween } from "../utils/date-utils.js";
import playSound from "../utils/playSound.js";
import { prepareRoutine } from "../utils/routine-utils.js";
import speakText from "../utils/speakText.js";
import Layout from "./Layout.js";

export default function App() {
  const { data: routines, fetchData: fetchRoutines } =
    usePbData("life_routines");
  const { data: config } = usePbData("life_configs", CONFIG_RECORD_ID);
  const {
    tasks = [],
    minutes = [],
    bulletin_board = "",
    studyWidgetData = [],
    subjectsSortOrder = [],
    radioStations = [],
  } = config;
  const { data: subjects } = usePbData("life_subjects");
  const [taskRoutines, setTaskRoutines] = useState([]);
  const [eventRoutines, setEventRoutines] = useState([]);
  const routineManager = new RoutineManager(taskRoutines, setTaskRoutines);
  const [calendarManager, setCalendarManager] = useState(
    new CalendarManager([])
  );
  const [calendarStudyEvents, setCalendarStudyEvents] = useState([]);

  const appContextValue = {
    tasks,
    subjects,
    minutes,
    bulletin_board,
    studyWidgetData,
    taskRoutines,
    eventRoutines,
    routineManager,
    calendarManager,
    setCalendarStudyEvents,
    subjectsSortOrder,
    radioStations,
  };

  const autoStackRoutine = async () => {
    const cleanRoutines = routineManager.getCleanRoutines();
    const routine = cleanRoutines.find((routine) =>
      isBetween(new Date(), routine.start, routine.end)
    );
    const dirtyRoutines = routineManager.getDirtyRoutines();
    if (routine && !dirtyRoutines.find((r) => r.parentId === routine.id)) {
      routineManager.setStackRoutine(routine);
      await playSound();
      const routineStartHHMM = dayjs(routine.start).format("HH:mm");
      const routineEndHHMM = dayjs(routine.end).format("HH:mm");
      await speakText(
        `${routine.title} ${routineStartHHMM}부터 ${routineEndHHMM}까지`
      );
      if (routine.description) {
        await speakText(routine.description);
      }
    }
  };

  const speakEveryHour = () => {
    if (sessionStorage.getItem("hourSpoken") === "true") {
      return;
    }
    if (dayjs().minute() === 0) {
      speakText(`${dayjs().hour()}시입니다.`);
      sessionStorage.setItem("hourSpoken", "true");
    } else {
      sessionStorage.setItem("hourSpoken", "false");
    }
  };

  useMinuteChangeEffect([autoStackRoutine, speakEveryHour]);

  useDateChangeEffect([fetchRoutines]);

  useEffect(() => {
    const { taskRoutines, eventRoutines } = prepareRoutine(routines);
    setTaskRoutines(taskRoutines);
    setEventRoutines(eventRoutines);
  }, [routines]);

  useEffect(() => {
    setCalendarManager(new CalendarManager(eventRoutines, calendarStudyEvents));
  }, [eventRoutines, calendarStudyEvents]);

  return html`
    <${AppContextProvider}
      value=${appContextValue}
      children=${html`<${Layout} />`}
    />
  `;
}
