import { CONFIG_RECORD_ID, PB_URL } from "../env.js";
import { AppContextProvider } from "../hooks/useAppContext.js";
import usePb from "../hooks/usePb.js";
import { html, useEffect, useState } from "../libs/preact.js";
import { signIn } from "../utils/pb-utils.js";
import Home from "./Home.js";

export default function App() {
  const { authenticated } = usePb();
  const [screenSaver, setScreenSaver] = useState(false);
  const [dataReady, setDataReady] = useState(true);
  const [rawRoutineData, setRawRoutineData] = useState([
    {
      title: "Morning Routine",
      start: "08:00",
      end: "09:00",
      description: "Wake up, brush teeth, shower, breakfast",
      repeat: ["MON", "TUE", "WED", "THU", "FRI"],
    },
  ]);
  const [rawUserRoutineData, setRawUserRoutineData] = useState([
    {
      title: "Rest",
      start: "08:00",
      end: "10:00",
      date: "2021-10-01",
      done: false,
    },
  ]);
  const [rawStudyData, setRawStudyData] = useState([
    {
      subject: "The Art of War",
      gapsBetween: [1, 2, 3, 4, 5],
      studyRoutines: [
        {
          what: "Chapter 1",
          how: "Read, take notes, summarize",
          done: false,
          doneDate: null,
        },
      ],
    },
  ]);
  const [rawCalendarData, setRawCalendarData] = useState([
    {
      title: "Morning Routine",
      description: "Wake up, brush teeth, shower, breakfast",
      start: "2024-07-03T08:00:00",
      end: "2024-07-03T09:00:00",
      repeat: "", // "YEARLY", "MONTHLY"
      allDay: true,
    },
  ]);

  useEffect(() => {}, []);

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

  // rawStudyData에서 expected 계산하고 subject key로 구분된 flat한 각각의 배열로 제공
  const studyData = (() => {
    const data = {};

    rawStudyData.forEach((study) => {
      const { subject, studyRoutines, gapsBetween } = study;
      const tempDoneSave = [];
      studyRoutines.forEach((routine, index) => {
        const { what, how, done, doneDate } = routine;
        let expectedDoneDate = null;

        if (done) {
          tempDoneSave.push(doneDate);
        } else {
          const gap = gapsBetween[index];
          if (tempDoneSave[index - 1]) {
            expectedDoneDate = dayjs(tempDoneSave[index - 1])
              .add(gap, "day")
              .format("YYYY-MM-DD");
          }
          tempDoneSave.push(expectedDoneDate);
        }

        if (!data[subject]) {
          data[subject] = [];
        }

        data[subject].push({
          what,
          how,
          done,
          doneDate,
          expectedDoneDate,
        });
      });
    });

    return data;
  })();
  // rawCalendarData에서 allDay 계산해서 추가, studyData에서 expected가 추가된 것들 allDay로 넣기
  const calendarData = (() => {
    const data = {
      calendar: [],
      study: [],
    };

    rawCalendarData.forEach((calendar) => {
      const item = {
        title: calendar.title,
        description: calendar.description,
        allDay: calendar.allDay,
      };

      let start = dayjs(calendar.start);
      let end = dayjs(calendar.end);

      if (calendar.allDay) {
        start = start.startOf("day");
        end = end.endOf("day");
      }

      switch (calendar.repeat) {
        case "YEARLY":
          for (let i = 0; i < 2; i++) {
            data.calendar.push({
              ...item,
              start: start.add(i, "year").toDate(),
              end: end.add(i, "year").toDate(),
            });
          }
          break;
        case "MONTHLY":
          for (let i = 0; i < 24; i++) {
            data.calendar.push({
              ...item,
              start: start.add(i, "month").toDate(),
              end: end.add(i, "month").toDate(),
            });
          }
          break;
        default:
          data.calendar.push({
            ...item,
            start: start.toDate(),
            end: end.toDate(),
          });
          break;
      }
    });

    Object.keys(studyData).forEach((subject) => {
      studyData[subject].forEach((study) => {
        const { what, how, done, doneDate, expectedDoneDate } = study;
        if (!(done ? doneDate : expectedDoneDate)) {
          return;
        }
        data.study.push({
          title: `${subject} ${what}`,
          description: how,
          start: dayjs(done ? doneDate : expectedDoneDate)
            .startOf("day")
            .toDate(),
          end: dayjs(done ? doneDate : expectedDoneDate)
            .endOf("day")
            .toDate(),
          allDay: true,
          backgroundColor: done ? "green" : "silver",
        });
      });
    });

    return data;
  })();
  // repeat 보고 오늘 루틴 데이터로 필터링, userRoutineData에서 오늘 아닌 것을 필터링해서 추가, calendarData에서 allDay가 아닌 것을 추가
  const routineData = (() => {
    const dayOfWeekStrList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayOfWeek = dayjs().day();
    const dayOfWeekStr = dayOfWeekStrList[dayOfWeek];
    let todayRoutine = rawRoutineData.filter((routine) =>
      routine.repeat.includes(dayOfWeekStr)
    );
    todayRoutine = todayRoutine.map((routine) => {
      const start = dayjs()
        .set("hour", routine.start.split(":")[0])
        .set("minute", routine.start.split(":")[1])
        .toDate();
      const end = dayjs()
        .set("hour", routine.end.split(":")[0])
        .set("minute", routine.end.split(":")[1])
        .toDate();

      return {
        title: routine.title,
        description: routine.description,
        start,
        end,
      };
    });
    const todayUserRoutineData = rawUserRoutineData.filter(
      (routine) => routine.date === dayjs().format("YYYY-MM-DD")
    );
    const todayUserDone = todayUserRoutineData
      .filter((routine) => routine.done)
      .map((routine) => {
        const start = dayjs()
          .set("hour", routine.start.split(":")[0])
          .set("minute", routine.start.split(":")[1])
          .toDate();
        const end = dayjs()
          .set("hour", routine.end.split(":")[0])
          .set("minute", routine.end.split(":")[1])
          .toDate();

        return {
          title: routine.title,
          description: routine.description,
          start,
          end,
        };
      });
    const todayUserToDo = todayUserRoutineData
      .filter((routine) => !routine.done)
      .map((routine) => {
        const start = dayjs()
          .set("hour", routine.start.split(":")[0])
          .set("minute", routine.start.split(":")[1])
          .toDate();
        const end = dayjs()
          .set("hour", routine.end.split(":")[0])
          .set("minute", routine.end.split(":")[1])
          .toDate();

        return {
          title: routine.title,
          description: routine.description,
          start,
          end,
        };
      });
    return { todayRoutine, todayUserDone, todayUserToDo };
  })();
  // calendarData에서 allDay인 것을 구분해서 추가
  const allDayTodayData = () => {
    let allDayToday = [];
    calendarData.calendar.forEach((calendar) => {
      if (calendar.allDay) {
        allDay.push(calendar);
      }
    });
    calendarData.study.forEach((study) => {
      if (study.allDay) {
        allDay.push(study);
      }
    });
    allDayToday = allDayToday.filter((calendar) => {
      return dayjs().isBetween(dayjs(calendar.start), dayjs(calendar.end));
    });
    return allDayToday;
  };

  return html`
    <${AppContextProvider}
      value=${{
        screenSaver,
        setScreenSaver,
        studyData,
        calendarData,
        routineData,
        allDayTodayData,
      }}
      children=${html`<${Home} />`}
    />
  `;
}
