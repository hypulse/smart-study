import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";
import showModal from "../../utils/showModal.js";

export default function StudyCalendar() {
  const ref = useRef();
  const { calendarStudyEvents } = useAppContext();

  useEffect(() => {
    if (!ref.current || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(ref.current, {
      initialView: "dayGridMonth",
      contentHeight: "auto",
      events: calendarStudyEvents,
      editable: false,
      headerToolbar: {
        center: "dayGridMonth",
      },
      eventClick: function (data) {
        showModal(data.event.extendedProps.description, data.event.title);
      },
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [calendarStudyEvents]);

  return html`<div ref=${ref} />`;
}
