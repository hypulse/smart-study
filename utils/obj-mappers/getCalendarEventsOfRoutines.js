import { ROUTINE_DATE } from "../../env.js";
import getColorByTitle from "../getColorByTitle.js";

function getCalendarEventsOfRoutines(
  /**
   * @type {Array<RawRoutine>}
   */
  rawRoutines,
  /**
   * @type {Array<RawUserRoutine>}
   */
  rawUserRoutines
) {
  const calendarEvents = [];
  rawRoutines.forEach(({ title, start, end, description, repeat, id }) => {
    const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
      ROUTINE_DATE ? dayjs(ROUTINE_DATE).day() : dayjs().day()
    ];
    if (!repeat.includes(dayOfWeek)) {
      return;
    }
    const startDate = dayjs()
      .set("hour", start.split(":")[0])
      .set("minute", start.split(":")[1])
      .toDate();
    const endDate = dayjs()
      .set("hour", end.split(":")[0])
      .set("minute", end.split(":")[1])
      .toDate();
    calendarEvents.push({
      isUserRoutine: false,
      id,
      title,
      start: startDate,
      end: endDate,
      description,
      backgroundColor: getColorByTitle(title),
    });
  });
  rawUserRoutines.forEach(({ title, start, end, description, done, id }) => {
    const startDate = dayjs()
      .set("hour", start.split(":")[0])
      .set("minute", start.split(":")[1])
      .toDate();
    const endDate = dayjs()
      .set("hour", end.split(":")[0])
      .set("minute", end.split(":")[1])
      .toDate();
    calendarEvents.push({
      isUserRoutine: true,
      id,
      title,
      start: startDate,
      end: endDate,
      description,
      backgroundColor: done ? getColorByTitle(title) : "silver",
    });
  });
  return calendarEvents;
}

export default getCalendarEventsOfRoutines;
