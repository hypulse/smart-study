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
        center: "",
      },
      eventClick: function (data) {
        showModal(data.event.extendedProps.description, data.event.title);
      },
    });

    calendar.render();

    const parent = ref.current.parentElement;
    const week = Math.floor(dayjs().date() / 7);
    parent.scrollTop = (parent.scrollHeight / 5) * week;

    return () => {
      calendar.destroy();
    };
  }, [calendarStudyEvents]);

  return html`
    <div style="height: 90vh; overflow-y: auto;">
      <div ref=${ref} />
    </div>
  `;
}
