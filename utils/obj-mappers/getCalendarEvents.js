function convertEventToCalendarEvent(rawEvent) {
  const { description, title, startDate, endDate } = rawEvent;
  const start = dayjs(startDate).startOf("day").toDate();
  let end = dayjs(startDate).endOf("day").toDate();
  if (endDate) {
    end = dayjs(endDate).endOf("day").toDate();
  }
  return {
    title,
    description,
    start,
    end,
    allDay: true,
  };
}

export default function getCalendarEvents(rawEvents) {
  const calendarEvents = [];

  rawEvents.forEach((rawEvent) => {
    switch (rawEvent.repeat) {
      case "YEARLY":
        for (let i = 0; i < 2; i++) {
          const newRawEvent = { ...rawEvent };
          newRawEvent.startDate = dayjs(rawEvent.startDate)
            .set("year", dayjs().year())
            .add(i, "year")
            .format("YYYY-MM-DD");
          if (newRawEvent.endDate) {
            newRawEvent.endDate = dayjs(rawEvent.endDate)
              .set("year", dayjs().year())
              .add(i, "year")
              .format("YYYY-MM-DD");
          }
          calendarEvents.push(convertEventToCalendarEvent(newRawEvent));
        }
        break;
      case "MONTHLY":
        for (let i = 0; i < 24; i++) {
          const newRawEvent = { ...rawEvent };
          newRawEvent.startDate = dayjs(rawEvent.startDate)
            .set("year", dayjs().year())
            .set("month", 0)
            .add(i, "month")
            .format("YYYY-MM-DD");
          if (newRawEvent.endDate) {
            newRawEvent.endDate = dayjs(rawEvent.endDate)
              .set("year", dayjs().year())
              .set("month", 0)
              .add(i, "month")
              .format("YYYY-MM-DD");
          }
          calendarEvents.push(convertEventToCalendarEvent(newRawEvent));
        }
        break;
      default:
        calendarEvents.push(convertEventToCalendarEvent(rawEvent));
        break;
    }
  });

  return calendarEvents;
}
