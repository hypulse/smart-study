import { CONFIG_RECORD_ID, PB_URL } from "../env.js";
import { AppContextProvider } from "../hooks/useAppContext.js";
import usePb from "../hooks/usePb.js";
import usePbData from "../hooks/usePbData.js";
import { html, useEffect, useState } from "../libs/preact.js";
import { getNewStudyData } from "../utils/object-mapper.js";
import { signIn, syncAuth } from "../utils/pb-utils.js";
import Home from "./Home.js";
import Popup from "./Popup.js";

export default function App() {
  const dayOfWeekStrList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const { authenticated } = usePb();
  const [screenSaver, setScreenSaver] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  /**
   * @type {{data: Array<RawRoutine>, ready: boolean}}
   */
  const { data: rawRoutineData, ready: rawRoutineReady } =
    usePbData("routines");
  /**
   * @type {{data: Array<RawUserRoutine>, ready: boolean}}
   */
  const { data: rawUserRoutineData, ready: rawUserRoutineReady } =
    usePbData("user_routines");
  /**
   * @type {{data: Array<RawStudy>, ready: boolean}}
   */
  const { data: rawStudyData, ready: rawStudyReady } = usePbData("studies");
  /**
   * @type {{data: Array<RawCalendar>, ready: boolean}}
   */
  const { data: rawCalendarData, ready: rawCalendarReady } =
    usePbData("calendar_events");
  /**
   * @type {{data: RawConfig, ready: boolean}}
   */
  const { data: rawConfigData, ready: rawConfigReady } = usePbData(
    "configs",
    CONFIG_RECORD_ID
  );
  const whatHowTemplate = rawConfigData.whatHowTemplate || [];
  const { data: subjects, ready: subjectsReady } = usePbData("subjects");

  useEffect(() => {
    syncAuth();
  }, []);

  useEffect(() => {
    if (rawStudyReady && rawConfigReady && subjectsReady) {
      setDataReady(true);
    }
  }, [
    rawRoutineReady,
    rawUserRoutineReady,
    rawStudyReady,
    rawCalendarReady,
    rawConfigReady,
    subjectsReady,
  ]);

  if (!PB_URL || !CONFIG_RECORD_ID) {
    function getLocal() {
      const pbUrl = localStorage.getItem("pb_url");
      const configRecordId = localStorage.getItem("config_record_id");
      if (pbUrl && configRecordId) {
        window.location.href = `?pb_url=${pbUrl}&config_record_id=${configRecordId}`;
      }
    }

    function saveLocal() {
      const pbUrl = document.getElementById("pb-url").value;
      const configRecordId = document.getElementById("config-record-id").value;
      localStorage.setItem("pb_url", pbUrl);
      localStorage.setItem("config_record_id", configRecordId);
      window.location.href = `?pb_url=${pbUrl}&config_record_id=${configRecordId}`;
    }

    return html`
      <div className="flex flex-col gap-2">
        <button type="button" className="btn" onClick=${getLocal}>
          Get Local
        </button>
        <input
          type="text"
          className="input input-bordered"
          placeholder="PB URL"
          id="pb-url"
        />
        <input
          type="text"
          className="input input-bordered"
          placeholder="Config Record ID"
          id="config-record-id"
        />
        <button type="button" className="btn btn-primary" onClick=${saveLocal}>
          Save Local
        </button>
      </div>
    `;
  }

  if (!authenticated) {
    async function login() {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      await signIn(username, password);
    }

    return html`
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Username"
          id="username"
        />
        <input
          type="password"
          className="input input-bordered"
          placeholder="Password"
          id="password"
        />
        <button type="button" className="btn btn-primary" onClick=${login}>
          Login
        </button>
      </div>
    `;
  }

  if (!dataReady) {
    return html`<div>Loading...</div>`;
  }

  const newStudyData = getNewStudyData(rawStudyData);

  return html`
    <${AppContextProvider}
      value=${{
        screenSaver,
        setScreenSaver,
        newStudyData,
        whatHowTemplate,
        subjects,
      }}
      children=${html`
        <${Home} />
        <${Popup} />
      `}
    />
  `;
}
