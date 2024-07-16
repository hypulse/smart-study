import { useAppContext } from "../../hooks/useAppContext.js";
import { html, useEffect, useRef } from "../../libs/preact.js";
import showModal from "../../utils/showModal.js";

export default function RoutineCalendar() {
  const ref = useRef();
  const { calendarRoutineEvents } = useAppContext();

  useEffect(() => {
    if (!ref.current || !window.FullCalendar) {
      return;
    }

    const calendar = new FullCalendar.Calendar(ref.current, {
      initialView: "timeGridDay",
      contentHeight: "auto",
      nowIndicator: true,
      slotDuration: "00:10:00",
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
  }, [calendarRoutineEvents]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const autoScroll = () => {
      const parent = ref.current.parentElement;
      parent.scrollTop = (parent.scrollHeight / 24) * dayjs().hour();
    };

    autoScroll();

    const interval = setInterval(autoScroll, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return html`
    <div style="height: 90vh; overflow-y: auto;">
      <div ref=${ref} />
    </div>
  `;
}