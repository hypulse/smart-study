import getSubjectIdTitleMap from "./getSubjectIdTitleMap.js";

function getCalendarEventsOfChapters(
  /**
   * @type {Record<string, NewChapter[]>}
   */
  chaptersBySubject,
  rawSubjects
) {
  const subjectIdTitleMap = getSubjectIdTitleMap(rawSubjects);
  /**
   * @type {CalendarEvent[]} events
   */
  const calendarEvents = [];
  const chapters = Object.values(chaptersBySubject).flat();
  chapters.forEach(({ subject, title, toDos }) => {
    toDos.forEach(({ done, doneDate, expectedDoneDate, what, how }) => {
      const subjectTitle = subjectIdTitleMap[subject];
      const date = done ? doneDate : expectedDoneDate;
      const start = dayjs(date).startOf("day").toDate();
      const end = dayjs(date).endOf("day").toDate();
      calendarEvents.push({
        title: `${subjectTitle}: ${title}`,
        description: what,
        start,
        end,
        allDay: true,
        backgroundColor: done ? "green" : "silver",
      });
    });
  });
  return calendarEvents;
}

export default getCalendarEventsOfChapters;
