function getCalendarEvents(rawEvents) {
  //     const events = useMemo(() => {
  //     function eventToCalendarEvent(event) {
  //       const { date, description, title } = event;
  //       return {
  //         title,
  //         description,
  //         start: dayjs(date).startOf("day").toDate(),
  //         end: dayjs(date).endOf("day").toDate(),
  //         allDay: true,
  //       };
  //     }
  //     let list = [];
  //     rawEvents.forEach((rawEvent) => {
  //       if (rawEvent.repeat === "YEARLY") {
  //         for (var i = 0; i <= 1; i++) {
  //           rawEvent.date = dayjs(rawEvent.date)
  //             .set("year", dayjs().year())
  //             .add(i, "year")
  //             .format("YYYY-MM-DD");
  //           list.push(eventToCalendarEvent(rawEvent));
  //         }
  //         return;
  //       }
  //       if (rawEvent.repeat === "MONTHLY") {
  //         for (var i = 0; i < 24; i++) {
  //           rawEvent.date = dayjs(rawEvent.date)
  //             .set("year", dayjs().year())
  //             .set("month", 0)
  //             .add(i, "month")
  //             .format("YYYY-MM-DD");
  //           list.push(eventToCalendarEvent(rawEvent));
  //         }
  //         return;
  //       }
  //       list.push(eventToCalendarEvent(rawEvent));
  //     });
  //     return list;
  //   }, [rawEvents]);

  return [];
}

export default getCalendarEvents;
