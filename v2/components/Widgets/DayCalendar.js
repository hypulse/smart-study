import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";
import showModal from "../../utils/showModal.js";

export default function DayCalendar() {
  const { calendarRoutineEvents } = useAppContext();
  const ref = useRef();

  useEffect(() => {
    if (!ref.current || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(ref.current, {
      initialView: "timeGridDay",
      events: calendarRoutineEvents,
      editable: false,
      headerToolbar: {
        center: "timeGridDay",
      },
      validRange: {
        start: dayjs().startOf("day").toDate(),
        end: dayjs().endOf("day").toDate(),
      },
      eventClick: function (data) {
        showModal(data.event.extendedProps.description, data.event.title);
      },
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, []);

  return html`<div ref=${ref} />`;
}
