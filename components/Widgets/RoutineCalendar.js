import { ROUTINE_DATE } from "../../env.js";
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
    const toolbar = document.querySelector(`.fc-toolbar`);
    toolbar.style.position = "absolute";
    toolbar.style.background = "black";
    toolbar.style.zIndex = "9999";

    const prevBtn = document.querySelector(
      `.fc-toolbar [title="Previous day"]`
    );
    const nextBtn = document.querySelector(`.fc-toolbar [title="Next day"]`);
    const todayBtn = document.querySelector(`.fc-toolbar [title="Today"]`);
    [prevBtn, nextBtn, todayBtn].forEach((btn) => {
      btn.disabled = false;
    });
    prevBtn.onclick = () => {
      const params = new URLSearchParams(window.location.search);
      params.set(
        "routine_date",
        `${dayjs(ROUTINE_DATE).add(-1, "day").format("YYYY-MM-DD")}`
      );
      window.location.search = params.toString();
    };
    nextBtn.onclick = () => {
      const params = new URLSearchParams(window.location.search);
      params.set(
        "routine_date",
        `${dayjs(ROUTINE_DATE).add(1, "day").format("YYYY-MM-DD")}`
      );
      window.location.search = params.toString();
    };
    todayBtn.onclick = () => {
      const params = new URLSearchParams(window.location.search);
      params.set("routine_date", `${dayjs().format("YYYY-MM-DD")}`);
      window.location.search = params.toString();
    };

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

  useEffect(() => {
    const speakRoutine = () => {
      const routineAlertedListDate = localStorage.getItem(
        "routineAlertedList-date"
      );
      if (routineAlertedListDate !== dayjs().format("YYYY-MM-DD")) {
        localStorage.removeItem("routineAlertedList");
        localStorage.setItem(
          "routineAlertedList-date",
          dayjs().format("YYYY-MM-DD")
        );
      }
      const routineAlertedList = localStorage.getItem("routineAlertedList")
        ? JSON.parse(localStorage.getItem("routineAlertedList"))
        : [];

      const routine = calendarRoutineEvents.find(
        ({ isUserRoutine, id, start, end }) =>
          !isUserRoutine &&
          !routineAlertedList.includes(id) &&
          dayjs().isBetween(dayjs(start), dayjs(end))
      );

      if (routine) {
        routineAlertedList.push(routine.id);
        localStorage.setItem(
          "routineAlertedList",
          JSON.stringify(routineAlertedList)
        );
        speak(`${routine.title}을 시작하세요. ${routine.description}`);
      }
    };

    speakRoutine();

    const interval = setInterval(speakRoutine, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [calendarRoutineEvents]);

  return html`
    <div style="height: 90vh; overflow-y: auto;">
      <div ref=${ref} />
    </div>
  `;
}
