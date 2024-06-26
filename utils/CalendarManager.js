import { isToday } from "./date-utils.js";

class CalendarManager {
  static validRange = {
    start: dayjs().startOf("year").subtract(1, "year").toDate(),
    end: dayjs().endOf("year").add(1, "year").toDate(),
  };

  constructor(eventRoutines, calendarStudyEvents) {
    this.eventRoutines = eventRoutines;
    this.calendarStudyEvents = calendarStudyEvents;
  }

  getEvents = () => {
    const startYear = dayjs(CalendarManager.validRange.start).year();
    const startMonth = dayjs(CalendarManager.validRange.start).month();
    let yearDiff = dayjs(CalendarManager.validRange.start).diff(
      dayjs(CalendarManager.validRange.end),
      "year"
    );
    let monthDiff = dayjs(CalendarManager.validRange.start).diff(
      dayjs(CalendarManager.validRange.end),
      "month"
    );
    yearDiff = Math.abs(yearDiff);
    monthDiff = Math.abs(monthDiff);

    /**
     * @type {Array<ConvEventRoutine & DatabaseField}
     */
    const routines = this.eventRoutines.map((routine) => {
      if (routine.repeatTypeEvent) {
        routine.start = dayjs(routine.start).set("year", startYear).toDate();
        if (routine.end) {
          routine.end = dayjs(routine.end).set("year", startYear).toDate();
        }
        if (routine.repeatTypeEvent === "monthly") {
          routine.start = dayjs(routine.start)
            .set("month", startMonth)
            .toDate();
          if (routine.end) {
            routine.end = dayjs(routine.end).set("month", startMonth).toDate();
          }
        }
      }
      return routine;
    });

    routines.forEach((routine) => {
      if (routine.repeatTypeEvent === "yearly") {
        for (let i = 1; i <= yearDiff; i++) {
          const newRoutine = { ...routine };
          newRoutine.start = dayjs(routine.start).add(i, "year").toDate();
          if (routine.end) {
            newRoutine.end = dayjs(routine.end).add(i, "year").toDate();
          }
          routines.push(newRoutine);
        }
      } else if (routine.repeatTypeEvent === "monthly") {
        for (let i = 1; i <= monthDiff; i++) {
          const newRoutine = { ...routine };
          newRoutine.start = dayjs(routine.start).add(i, "month").toDate();
          if (routine.end) {
            newRoutine.end = dayjs(routine.end).add(i, "month").toDate();
          }
          routines.push(newRoutine);
        }
      }
    });

    if (this.calendarStudyEvents) {
      routines.push(...this.calendarStudyEvents);
    }

    return routines;
  };

  getEventsForPlanner = () => {
    const events = this.getEvents();
    return events.filter((event) => {
      if (
        !event.allDay &&
        isToday(event.start) &&
        event.end &&
        isToday(event.end)
      ) {
        return true;
      }
      return false;
    });
  };
}

export default CalendarManager;
