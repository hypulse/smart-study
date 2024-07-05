import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";

export default function Calendar() {
  const ref = useRef();
  const { calendarData } = useAppContext();

  useEffect(() => {
    if (!ref.current || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(ref.current, {
      initialView: "dayGridMonth",
      events: [...calendarData.calendar, ...calendarData.study],
      editable: false,
      headerToolbar: {
        center: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      eventClick: function (data) {
        window.showModal(
          data.event.extendedProps.description,
          data.event.title
        );
      },
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, []);

  return html`<div ref=${ref} />`;
}
