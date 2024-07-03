import { useAppContext } from "../../hooks/useAppContext.js";
import useMinuteChangeEffect from "../../hooks/useMinuteChangeEffect.js";
import {
  html,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../libs/preact.js";
import { hhmmFormatDate } from "../../utils/date-utils.js";
import PlannerCell from "./PlannerCell.js";

export default function Planner() {
  const { routineManager, calendarManager } = useAppContext();
  const cleanRoutines = routineManager.getCleanRoutines();
  const doneRoutines = routineManager.getDoneRoutines();
  const events = useMemo(
    () => calendarManager.getEventsForPlanner(),
    [calendarManager]
  );
  const ref = useRef(null);

  const grids = (() => {
    const _grids = [];
    for (let i = 0; i < 24; i++) {
      _grids.push(html`<${Grid} i=${i} key=${i} />`);
    }
    return _grids;
  })();

  useMinuteChangeEffect([
    () => {
      ref.current.scrollTop = dayjs().hour() * 60;
    },
  ]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.scrollTop = dayjs().hour() * 60;
  }, []);

  return html`
    <div style="position: relative; height: 480px; overflow: auto;" ref=${ref}>
      ${grids}
      <div style="position: absolute; width: 50%; top: 0; left: 0;">
        ${cleanRoutines.map(
          (routine) => html`
            <${PlannerCell} routine=${routine} key=${routine.id} />
          `
        )}
      </div>
      <div style="position: absolute; width: 50%; top: 0; left: 25%;">
        ${events.map(
          (event) => html`<${PlannerCell} routine=${event} key=${event.id} />`
        )}
      </div>
      <div style="position: absolute; width: 50%; top: 0; left: 50%;">
        ${doneRoutines.map(
          (routine) => html`
            <${PlannerCell} routine=${routine} key=${routine.id} />
          `
        )}
      </div>
      <${TimelineNow} />
    </div>
  `;
}

function Grid({ i }) {
  return html`
    <div style="position: relative; height: 60px;" className="border-t">
      <span style="right: 0; position: absolute;">
        ${i.toString().padStart(2, "0")}:00
      </span>
    </div>
  `;
}

function TimelineNow() {
  const [top, setTop] = useState(dayjs().hour() * 60 + dayjs().minute());

  useMinuteChangeEffect([
    () => {
      const newTop = dayjs().hour() * 60 + dayjs().minute();
      setTop(newTop);
    },
  ]);

  return html`
    <div
      style="position: absolute; width: 100%; top: ${top}px; right: 0;"
      className="border-t border-primary"
    >
      <span
        style="right: 0; position: absolute;"
        className="text-primary font-bold"
        >${hhmmFormatDate()}</span
      >
    </div>
  `;
}
