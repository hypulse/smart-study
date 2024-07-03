import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";

export default function Calendar() {
  const { calendarManager } = useAppContext();
  const ref = useRef();

  useEffect(() => {
    if (!ref.current || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(ref.current, {
      initialView: localStorage.getItem("calendarView") || "dayGridMonth",
      events: calendarManager.getEvents(),
      editable: false,
      validRange: calendarManager.validRange,
      headerToolbar: {
        center: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      eventClick: function (info) {
        if (info.event.extendedProps.description) {
          window.setToast(info.event.extendedProps.description);
        }
      },
    });

    calendar.render();

    ref.current
      .querySelector(".fc-dayGridMonth-button")
      .addEventListener("click", () => {
        localStorage.setItem("calendarView", "dayGridMonth");
      });
    ref.current
      .querySelector(".fc-timeGridWeek-button")
      .addEventListener("click", () => {
        localStorage.setItem("calendarView", "timeGridWeek");
      });
    ref.current
      .querySelector(".fc-timeGridDay-button")
      .addEventListener("click", () => {
        localStorage.setItem("calendarView", "timeGridDay");
      });

    return () => {
      calendar.destroy();
    };
  }, [calendarManager]);

  return html`<div ref=${ref} />`;
}
