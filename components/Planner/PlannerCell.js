import { html } from "../../libs/preact.js";
import stringToHslColor from "../../utils/stringToHslColor.js";

/**
 * @param {{
 * routine: ConvTaskRoutine
 * }} param0
 */
export default function PlannerCell({ routine }) {
  const isDone = routine.taskState === "done";
  let routineStart, routineEnd;
  routineStart = isDone ? routine.userStart : routine.start;
  routineEnd = isDone ? routine.userEnd : routine.end;
  const top = dayjs(routineStart).diff(dayjs().startOf("day"), "minute");
  const height = dayjs(routineEnd).diff(dayjs(routineStart), "minute");
  const background = stringToHslColor(routine.title);
  const routineMinutes = dayjs(routineEnd).diff(dayjs(routineStart), "minute");
  const routineStartHHMM = dayjs(routineStart).format("HH:mm");
  const routineEndHHMM = dayjs(routineEnd).format("HH:mm");

  return html`
    <div
      style="position: absolute; top: ${top}px; height: ${height}px; width: 100%; background: ${background};"
      className="flex items-center justify-center"
    >
      <span
        className="text-white text-sm font-bold ${routine.description
          ? "tooltip"
          : ""}"
        data-tip="${routine.description}"
      >
        ${routine.title} (${routineMinutes}분, ${routineStartHHMM} ~${" "}
        ${routineEndHHMM})
      </span>
    </div>
  `;
}
