import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";
import showModal from "../../utils/showModal.js";

export default function Calendar() {
  const ref = useRef();
  const { calendarEvents } = useAppContext();

  useEffect(() => {
    if (!ref.current || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(ref.current, {
      initialView: "dayGridMonth",
      events: calendarEvents,
      editable: false,
      headerToolbar: {
        center: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      eventClick: function (data) {
        showModal(data.event.extendedProps.description, data.event.title);
      },
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [calendarEvents]);

  return html`<div ref=${ref} />`;
}
