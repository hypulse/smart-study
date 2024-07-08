import { CONFIG_RECORD_ID, PB_URL } from "../../env.js";
import { AppContextProvider } from "../../hooks/useAppContext.js";
import usePb from "../../hooks/usePb.js";
import usePbData from "../../hooks/usePbData.js";
import { html, useEffect, useState } from "../../libs/preact.js";
import getChaptersBySubject from "../../utils/obj-mappers/getChaptersBySubject.js";
import { syncAuth } from "../../utils/pb-utils.js";
import Home from "../HomeComps/Home.js";
import Loading from "../Loading.js";
import EnterCred from "./EnterCred.js";
import EnterDataInfo from "./EnterDataInfo.js";
import Popup from "./Popup.js";
import getCalendarEventsOfChapters from "../../utils/obj-mappers/getCalendarEventsOfChapters.js";
import getCalendarEventsOfRoutines from "../../utils/obj-mappers/getCalendarEventsOfRoutines.js";

export default function App() {
  const { authenticated } = usePb();
  const [dataReady, setDataReady] = useState(false);
  const {
    data: rawConfig,
    ready: rawConfigReady,
    fetchData: updateRawConfig,
  } = usePbData("configs", CONFIG_RECORD_ID);
  const {
    data: rawSubjects,
    ready: rawSubjectsReady,
    fetchData: updateRawSubjects,
  } = usePbData("subjects");
  const {
    data: rawChapters,
    ready: rawChaptersReady,
    fetchData: updateRawChapters,
  } = usePbData("chapters");
  const { data: rawRoutines, ready: rawRoutinesReady } = usePbData("routines");
  const {
    data: rawUserRoutines,
    ready: rawUserRoutinesReady,
    fetchData: updateRawUserRoutines,
  } = usePbData("user_routines", null, {
    filter: `date = '${dayjs().format("YYYY-MM-DD")}'`,
  });

  function updateRawData(e) {
    const list = e.detail;

    if (!list) {
      updateRawConfig();
      updateRawSubjects();
      updateRawChapters();
      updateRawUserRoutines();
      return;
    }

    if (list.includes("updateRawConfig")) updateRawConfig();
    if (list.includes("updateRawSubjects")) updateRawSubjects();
    if (list.includes("updateRawChapters")) updateRawChapters();
    if (list.includes("updateRawUserRoutines")) updateRawRoutines();
  }

  useEffect(() => {
    syncAuth();
    document.addEventListener("updateRawData", updateRawData);

    return () => {
      document.removeEventListener("updateRawData", updateRawData);
    };
  }, []);

  useEffect(() => {
    if (
      rawConfigReady &&
      rawSubjectsReady &&
      rawChaptersReady &&
      rawRoutinesReady &&
      rawUserRoutinesReady
    ) {
      setDataReady(true);
    }
  }, [
    rawConfigReady,
    rawSubjectsReady,
    rawChaptersReady,
    rawRoutinesReady,
    rawUserRoutinesReady,
  ]);

  if (!PB_URL || !CONFIG_RECORD_ID) {
    return html`<${EnterDataInfo} />`;
  }

  if (!authenticated) {
    return html`<${EnterCred} />`;
  }

  if (!dataReady) {
    return html`<${Loading} />`;
  }

  const chaptersBySubject = getChaptersBySubject(rawChapters, rawSubjects);
  const calendarStudyEvents = getCalendarEventsOfChapters(
    chaptersBySubject,
    rawSubjects
  );
  const calendarRoutineEvents = getCalendarEventsOfRoutines(
    rawRoutines,
    rawUserRoutines
  );
  const routinesToDo = rawUserRoutines.filter(({ done }) => !done);

  return html`
    <${AppContextProvider}
      value=${{
        rawConfig,
        rawSubjects,
        rawChapters,
        chaptersBySubject,
        calendarStudyEvents,
        calendarRoutineEvents,
        routinesToDo,
      }}
      children=${html`
        <${Home} />
        <${Popup} />
      `}
    />
  `;
}
