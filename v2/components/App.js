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

  useEffect(() => {
    syncAuth();
  }, []);

  useEffect(() => {
    console.table({
      rawRoutineReady,
      rawUserRoutineReady,
      rawStudyReady,
      rawCalendarReady,
      rawConfigReady,
    });
    if (rawStudyReady && rawConfigReady) {
      setDataReady(true);
    }
  }, [
    rawRoutineReady,
    rawUserRoutineReady,
    rawStudyReady,
    rawCalendarReady,
    rawConfigReady,
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

  // // rawCalendarData에서 allDay 계산해서 추가, studyData에서 expected가 추가된 것들 allDay로 넣기
  // const calendarData = (() => {
  //   const data = {
  //     calendar: [],
  //     study: [],
  //   };

  //   rawCalendarData.forEach((calendar) => {
  //     const item = {
  //       title: calendar.title,
  //       description: calendar.description,
  //       allDay: calendar.allDay,
  //     };

  //     let start = dayjs(calendar.start);
  //     let end = dayjs(calendar.end);

  //     if (calendar.allDay) {
  //       start = start.startOf("day");
  //       end = end.endOf("day");
  //     }

  //     switch (calendar.repeat) {
  //       case "YEARLY":
  //         for (let i = 0; i < 2; i++) {
  //           data.calendar.push({
  //             ...item,
  //             start: start.add(i, "year").toDate(),
  //             end: end.add(i, "year").toDate(),
  //           });
  //         }
  //         break;
  //       case "MONTHLY":
  //         for (let i = 0; i < 24; i++) {
  //           data.calendar.push({
  //             ...item,
  //             start: start.add(i, "month").toDate(),
  //             end: end.add(i, "month").toDate(),
  //           });
  //         }
  //         break;
  //       default:
  //         data.calendar.push({
  //           ...item,
  //           start: start.toDate(),
  //           end: end.toDate(),
  //         });
  //         break;
  //     }
  //   });

  //   Object.keys(studyData).forEach((subject) => {
  //     studyData[subject].forEach((chapterData) => {
  //       const { chapterStudyRoutines } = chapterData;
  //       chapterStudyRoutines.forEach((chapterRoutine) => {
  //         const { what, how, done, doneDate, expectedDoneDate } =
  //           chapterRoutine;

  //         if (!(done ? doneDate : expectedDoneDate)) {
  //           return;
  //         }

  //         data.study.push({
  //           title: `${subject} (${what})`,
  //           description: how,
  //           start: dayjs(done ? doneDate : expectedDoneDate)
  //             .startOf("day")
  //             .toDate(),
  //           end: dayjs(done ? doneDate : expectedDoneDate)
  //             .endOf("day")
  //             .toDate(),
  //           allDay: true,
  //           backgroundColor: done ? "green" : "silver",
  //         });
  //       });
  //     });
  //   });

  //   return data;
  // })();
  // // repeat 보고 오늘 루틴 데이터로 필터링, userRoutineData에서 오늘 아닌 것을 필터링해서 추가, calendarData에서 allDay가 아닌 것을 추가
  // const routineData = (() => {
  //   const dayOfWeek = dayjs().day();
  //   const dayOfWeekStr = dayOfWeekStrList[dayOfWeek];
  //   let todayRoutine = rawRoutineData.filter((routine) =>
  //     routine.repeat.includes(dayOfWeekStr)
  //   );
  //   todayRoutine = todayRoutine.map((routine) => {
  //     const start = dayjs()
  //       .set("hour", routine.start.split(":")[0])
  //       .set("minute", routine.start.split(":")[1])
  //       .toDate();
  //     const end = dayjs()
  //       .set("hour", routine.end.split(":")[0])
  //       .set("minute", routine.end.split(":")[1])
  //       .toDate();

  //     return {
  //       title: routine.title,
  //       description: routine.description,
  //       start,
  //       end,
  //     };
  //   });
  //   const todayUserRoutineData = rawUserRoutineData.filter(
  //     (routine) => routine.date === dayjs().format("YYYY-MM-DD")
  //   );
  //   const todayUserDone = todayUserRoutineData
  //     .filter((routine) => routine.done)
  //     .map((routine) => {
  //       const start = dayjs()
  //         .set("hour", routine.start.split(":")[0])
  //         .set("minute", routine.start.split(":")[1])
  //         .toDate();
  //       const end = dayjs()
  //         .set("hour", routine.end.split(":")[0])
  //         .set("minute", routine.end.split(":")[1])
  //         .toDate();

  //       return {
  //         title: routine.title,
  //         description: routine.description,
  //         start,
  //         end,
  //       };
  //     });
  //   const todayUserToDo = todayUserRoutineData
  //     .filter((routine) => !routine.done)
  //     .map((routine) => {
  //       const start = dayjs()
  //         .set("hour", routine.start.split(":")[0])
  //         .set("minute", routine.start.split(":")[1])
  //         .toDate();
  //       const end = dayjs()
  //         .set("hour", routine.end.split(":")[0])
  //         .set("minute", routine.end.split(":")[1])
  //         .toDate();

  //       return {
  //         title: routine.title,
  //         description: routine.description,
  //         start,
  //         end,
  //       };
  //     });
  //   return { todayRoutine, todayUserDone, todayUserToDo };
  // })();
  // // calendarData에서 allDay인 것을 구분해서 추가
  // const allDayTodayData = () => {
  //   let allDayToday = [];
  //   calendarData.calendar.forEach((calendar) => {
  //     if (calendar.allDay) {
  //       allDay.push(calendar);
  //     }
  //   });
  //   calendarData.study.forEach((study) => {
  //     if (study.allDay) {
  //       allDay.push(study);
  //     }
  //   });
  //   allDayToday = allDayToday.filter((calendar) => {
  //     return dayjs().isBetween(dayjs(calendar.start), dayjs(calendar.end));
  //   });
  //   return allDayToday;
  // };

  return html`
    <${AppContextProvider}
      value=${{
        screenSaver,
        setScreenSaver,
        newStudyData,
        whatHowTemplate,
      }}
      children=${html`
        <${Home} />
        <${Popup} />
      `}
    />
  `;
}
